const { Booking, Service, Provider, User, OtpVerification } = require('../models');
const { optionalAuth } = require('../middleware/auth');
const NotificationFactory = require('../services/notificationService');
const { sendSuccess, sendError, sendNotFound, sendConflict, sendCreated, sendUnauthorized, sendForbidden } = require('../utils/responseHelper');
const { normalizePhoneNumber } = require('../utils/phoneNormalizer');

// Send OTP for guest booking (Step 1)
const sendBookingOTP = async (req, res) => {
  try {
    let { customer_phone } = req.body;

    // Normalize phone number if provided
    if (customer_phone) {
      customer_phone = normalizePhoneNumber(customer_phone);
    }

    if (!customer_phone) {
      return sendError(res, {
        message: 'phone_required',
        statusCode: 400,
        language: req.language
      });
    }

    // Generate and send OTP
    const otpRecord = await OtpVerification.createOTP(
      customer_phone,
      'booking_confirmation',
      'phone'
    );

    // Send OTP via notification service
    const notificationService = NotificationFactory.getService();
    await notificationService.sendOTP(
      customer_phone,
      otpRecord.otp,
      'booking_confirmation'
    );

    return sendSuccess(res, {
      message: 'otp_sent',
      language: req.language,
      data: {
        expires_at: otpRecord.expires_at,
        phone: customer_phone
      }
    });
  } catch (error) {
    console.error('Send booking OTP error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

// Create booking (Step 2 - requires OTP for guest users)
const createBooking = async (req, res) => {
  try {
    let {
      service_id,
      provider_id,
      booking_date,
      booking_time,
      duration_hours,
      package_selected,
      add_ons_selected,
      service_address,
      service_city,
      service_area,
      latitude,
      longitude,
      customer_name,
      customer_phone,
      customer_email,
      customer_notes,
      otp,
    } = req.body;
    
    // Normalize phone number if provided
    if (customer_phone) {
      customer_phone = normalizePhoneNumber(customer_phone);
    }
    
    // If user is not authenticated, handle guest booking
    let userId = req.user?.id;
    
    if (!userId) {
      // For guest bookings, OTP is REQUIRED
      if (!otp || !customer_phone) {
        return sendError(res, {
          message: 'otp_required',
          statusCode: 400,
          language: req.language
        });
      }

      // Verify OTP - REQUIRED for guest bookings
      const isValidOTP = await OtpVerification.verifyOTP(
        customer_phone,
        otp,
        'booking_confirmation',
        'phone'
      );
      
      if (!isValidOTP) {
        return sendError(res, {
          message: 'otp_invalid',
          statusCode: 400,
          language: req.language
        });
      }
      
      // Create or find guest user (only after OTP verification)
      let guestUser = await User.findOne({ where: { phone: customer_phone } });
      
      if (!guestUser) {
        // Create new user from guest info
        guestUser = await User.create({
          first_name: customer_name.split(' ')[0],
          last_name: customer_name.split(' ').slice(1).join(' ') || '',
          phone: customer_phone,
          email: customer_email,
          role: 'customer',
          is_verified: true, // Auto-verified after OTP
        });
        console.log(`✅ Created new user account for guest booking: ${guestUser.phone}`);
      } else {
        console.log(`✅ Found existing user for guest booking: ${guestUser.phone}`);
      }
      
      userId = guestUser.id;
    }
    
    // Get service details
    const service = await Service.findByPk(service_id);
    
    if (!service || !service.is_active) {
      return sendNotFound(res, {
        message: 'service_inactive',
        language: req.language
      });
    }
    
    // Calculate pricing
    let basePrice = service.base_price;
    
    // Apply package pricing if selected
    if (package_selected && service.packages) {
      const selectedPackage = service.packages.find(p => p.name === package_selected);
      if (selectedPackage) {
        basePrice = selectedPackage.price;
      }
    }
    
    // Calculate add-ons price
    let addOnsPrice = 0;
    if (add_ons_selected && add_ons_selected.length > 0 && service.add_ons) {
      add_ons_selected.forEach(addonName => {
        const addon = service.add_ons.find(a => a.name === addonName);
        if (addon) {
          addOnsPrice += parseFloat(addon.price);
        }
      });
    }
    
    // Calculate total price
    const totalPrice = (parseFloat(basePrice) * parseFloat(duration_hours)) + addOnsPrice;
    
    // Generate booking number
    const generateBookingNumber = () => {
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 5).toUpperCase();
      return `BK${timestamp}${random}`;
    };
    
    // Create booking
    const booking = await Booking.create({
      booking_number: generateBookingNumber(),
      user_id: userId,
      provider_id,
      service_id,
      booking_date,
      booking_time,
      duration_hours,
      package_selected,
      add_ons_selected,
      service_address,
      service_city,
      service_area,
      latitude,
      longitude,
      base_price: basePrice,
      add_ons_price: addOnsPrice,
      total_price: totalPrice,
      customer_notes,
      status: 'pending_provider_accept',
      payment_status: 'pending',
    });
    
    // Send confirmation notification to customer
    const notificationService = NotificationFactory.getService();
    await notificationService.sendBookingConfirmation(
      customer_phone || req.user?.phone,
      {
        booking_number: booking.booking_number,
        booking_date,
        booking_time,
        total_price: totalPrice,
      }
    );
    
    // Send notification to provider
    try {
      const provider = await Provider.findByPk(provider_id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['first_name', 'last_name', 'phone'],
          },
        ],
      });
      
      if (provider && provider.user && provider.user.phone) {
        const customerName = customer_name || (req.user ? `${req.user.first_name} ${req.user.last_name}` : 'Guest Customer');
        const serviceName = service.name;
        const bookingDateTime = `${booking_date} at ${booking_time}`;
        
        // For SMS notification service, use sendSMS method
        const providerMessage = `New booking received! ${customerName} has booked "${serviceName}" for ${bookingDateTime}. Booking #${booking.booking_number}. Total: $${totalPrice}. Please check your dashboard for details.`;
        
        if (typeof notificationService.sendSMS === 'function') {
          await notificationService.sendSMS(provider.user.phone, providerMessage);
        } else {
          // Fallback: Send as custom message
          console.log(`Provider notification: ${providerMessage}`);
        }
        
        console.log(`Provider notification sent to ${provider.user.phone}: ${providerMessage}`);
      }
    } catch (providerNotificationError) {
      console.error('Failed to send provider notification:', providerNotificationError);
      // Don't fail the booking if provider notification fails
    }
    
    return sendCreated(res, {
      message: 'booking_created',
      language: req.language,
      data: { booking },
    });
  } catch (error) {
    console.error('Create booking error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

// Get my bookings (for authenticated users)
const getMyBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, sort_by = 'created_at', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause based on user role
    let whereClause = {};
    
    if (req.user.role === 'customer') {
      whereClause.user_id = req.user.id;
    } else if (req.user.role === 'provider') {
      whereClause.provider_id = req.user.provider_id;
    } else if (req.user.role === 'admin') {
      // Admin can see all bookings
      whereClause = {};
    } else {
      return sendForbidden(res, {
        message: 'unauthorized',
        language: req.language
      });
    }

    // Add status filter if provided
    if (status) {
      whereClause.status = status;
    }

    // Build order clause
    const orderClause = [[sort_by, order.toUpperCase()]];

    const { count, rows: bookings } = await Booking.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['first_name', 'last_name', 'phone', 'email'],
        },
        {
          model: Provider,
          as: 'provider',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['first_name', 'last_name', 'phone'],
            },
          ],
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'name', 'description', 'base_price'],
        },
      ],
      order: orderClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(count / limit);

    // Hide provider phone number for customers until booking is confirmed
    let processedBookings = bookings;
    
    if (req.user.role === 'customer') {
      processedBookings = bookings.map(booking => {
        const bookingData = booking.toJSON();
        
        if (bookingData.provider && bookingData.provider.user) {
          // Hide phone if booking is not confirmed
          if (bookingData.status !== 'confirmed') {
            bookingData.provider.user.phone = null;
          }
        }
        
        return bookingData;
      });
    }

    return sendSuccess(res, {
      message: 'retrieved_successfully',
      language: req.language,
      data: {
        bookings: processedBookings,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_bookings: count,
          limit: parseInt(limit),
          has_next: page < totalPages,
          has_prev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['first_name', 'last_name', 'phone', 'email'],
        },
        {
          model: Provider,
          as: 'provider',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['first_name', 'last_name', 'phone'],
            },
          ],
        },
        {
          model: Service,
          as: 'service',
        },
      ],
    });
    
    if (!booking) {
      return sendNotFound(res, {
        message: 'booking_not_found',
        language: req.language
      });
    }
    
    // Check authorization
    if (req.user.role === 'customer' && booking.user_id !== req.user.id) {
      return sendForbidden(res, {
        message: 'booking_unauthorized',
        language: req.language
      });
    }
    
    if (req.user.role === 'provider' && booking.provider_id !== req.user.provider_id) {
      return sendForbidden(res, {
        message: 'booking_unauthorized',
        language: req.language
      });
    }
    
    // Hide provider phone number until booking is confirmed
    // Convert booking to JSON and modify provider data
    const bookingData = booking.toJSON();
    
    if (bookingData.provider && bookingData.provider.user) {
      // Only show phone if booking is confirmed (provider accepted)
      if (booking.status !== 'confirmed' && req.user.role === 'customer') {
        bookingData.provider.user.phone = null; // or 'hidden' depending on frontend requirements
      }
    }
    
    return sendSuccess(res, {
      message: 'booking_retrieved',
      language: req.language,
      data: { booking: bookingData },
    });
  } catch (error) {
    console.error('Get booking error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { status, amount_paid, provider_satisfaction } = req.body;
    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) {
      return sendNotFound(res, {
        message: 'booking_not_found',
        language: req.language
      });
    }
    
    // Check authorization
    const isProvider = req.user.role === 'provider' && booking.provider_id === req.user.provider_id;
    const isCustomer = req.user.role === 'customer' && booking.user_id === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isProvider && !isCustomer && !isAdmin) {
      return sendForbidden(res, {
        message: 'booking_unauthorized_update',
        language: req.language
      });
    }
    
    // Validate status transition
    const allowedTransitions = {
      pending_provider_accept: ['confirmed', 'cancelled'],
      confirmed: ['provider_on_way', 'cancelled'],
      provider_on_way: ['provider_arrived', 'cancelled'],
      provider_arrived: ['in_progress', 'cancelled'],
      in_progress: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
      refunded: [],
    };
    
    if (!allowedTransitions[booking.status].includes(status)) {
      return sendError(res, {
        message: 'booking_status_invalid',
        statusCode: 400,
        language: req.language,
        variables: { current: booking.status, new: status }
      });
    }
    
    // When status is changed to 'completed', validate and require additional fields
    if (status === 'completed') {
      // Only provider can mark as completed and provide these details
      if (!isProvider && !isAdmin) {
        return sendForbidden(res, {
          message: 'only_provider_can_complete',
          statusCode: 403,
          language: req.language
        });
      }
      
      // Validate amount_paid if provided
      if (amount_paid !== undefined) {
        const amountPaid = parseFloat(amount_paid);
        if (isNaN(amountPaid) || amountPaid < 0) {
          return sendError(res, {
            message: 'invalid_amount_paid',
            statusCode: 400,
            language: req.language
          });
        }
        booking.amount_paid = amountPaid;
        
        // Update payment_status if amount_paid equals or exceeds total_price
        if (amountPaid >= parseFloat(booking.total_price)) {
          booking.payment_status = 'paid';
        }
      } else {
        // If not provided, default to total_price
        booking.amount_paid = parseFloat(booking.total_price);
        booking.payment_status = 'paid';
      }
      
      // Validate provider_satisfaction if provided
      if (provider_satisfaction !== undefined) {
        const satisfaction = parseFloat(provider_satisfaction);
        if (isNaN(satisfaction) || satisfaction < 1.0 || satisfaction > 5.0) {
          return sendError(res, {
            message: 'invalid_satisfaction_rating',
            statusCode: 400,
            language: req.language,
            variables: { min: 1.0, max: 5.0 }
          });
        }
        booking.provider_satisfaction = satisfaction;
      }
    }
    
    // Update status
    booking.status = status;
    
    // Set timestamps based on status
    if (status === 'confirmed') booking.confirmed_at = new Date();
    if (status === 'in_progress') booking.started_at = new Date();
    if (status === 'completed') booking.completed_at = new Date();
    if (status === 'cancelled') {
      booking.cancelled_at = new Date();
      booking.cancelled_by = req.user.role;
    }
    
    await booking.save();
    
    // Send notification
    const customer = await User.findByPk(booking.user_id);
    const notificationService = NotificationFactory.getService();
    await notificationService.sendStatusUpdate(
      customer.phone,
      {
        booking_number: booking.booking_number,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
      },
      status
    );
    
    return sendSuccess(res, {
      message: 'booking_status_updated',
      language: req.language,
      data: { booking },
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

// Provider accepts or rejects a booking
const providerAcceptOrRejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'accept' or 'reject'
    
    const booking = await Booking.findByPk(id, {
      include: [
        { model: Service, as: 'service' },
        { model: Provider, as: 'provider', include: [{ model: User, as: 'user' }] },
        { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'phone'] },
      ],
    });
    
    if (!booking) {
      return sendNotFound(res, {
        message: 'booking_not_found',
        language: req.language,
      });
    }
    
    // Check if provider owns this booking
    if (booking.provider_id !== req.user.provider?.id) {
      return sendForbidden(res, {
        message: 'unauthorized',
        language: req.language,
      });
    }
    
    if (booking.status !== 'pending_provider_accept') {
      return sendError(res, {
        message: 'booking_already_processed',
        statusCode: 400,
        language: req.language,
      });
    }
    
    if (action === 'accept') {
      booking.status = 'confirmed';
      booking.confirmed_at = new Date();
      
      // Send SMS to customer with provider phone number
      const customer = await User.findByPk(booking.user_id);
      const providerUser = await User.findByPk(booking.provider.user_id);
      
      if (customer && providerUser && customer.phone) {
        const notificationService = NotificationFactory.getService();
        const message = `Booking confirmed! Provider: ${booking.provider.user.first_name} ${booking.provider.user.last_name}, Phone: ${providerUser.phone}`;
        
        if (typeof notificationService.sendSMS === 'function') {
          await notificationService.sendSMS(customer.phone, message);
        } else {
          console.log(`Provider contact info sent to customer: ${message}`);
        }
      }
      
      await booking.save();
      
      return sendSuccess(res, {
        message: 'booking_accepted',
        language: req.language,
        data: { booking },
      });
    } else if (action === 'reject') {
      booking.status = 'cancelled';
      booking.cancelled_at = new Date();
      booking.cancelled_by = 'provider';
      booking.cancellation_reason = 'Provider rejected the booking';
      
      await booking.save();
      
      return sendSuccess(res, {
        message: 'booking_rejected',
        language: req.language,
        data: { booking },
      });
    } else {
      return sendError(res, {
        message: 'invalid_action',
        statusCode: 400,
        language: req.language,
      });
    }
  } catch (error) {
    console.error('Provider accept/reject booking error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

// Cancel booking with reason
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellation_category, cancellation_reason } = req.body;
    
    const booking = await Booking.findByPk(id, {
      include: [
        { model: Service, as: 'service' },
        { model: Provider, as: 'provider' },
      ],
    });
    
    if (!booking) {
      return sendNotFound(res, {
        message: 'booking_not_found',
        language: req.language,
      });
    }
    
    // Check if user has permission to cancel
    const isCustomer = booking.user_id === req.user?.id;
    const isProvider = booking.provider_id === req.user?.provider?.id;
    
    if (!isCustomer && !isProvider) {
      return sendForbidden(res, {
        message: 'unauthorized',
        language: req.language,
      });
    }
    
    // Can only cancel if confirmed (provider has accepted) and before service time
    if (booking.status !== 'confirmed') {
      return sendError(res, {
        message: 'booking_cannot_be_cancelled',
        statusCode: 400,
        language: req.language,
      });
    }
    
    const serviceDateTime = new Date(`${booking.booking_date}T${booking.booking_time}`);
    if (new Date() >= serviceDateTime) {
      return sendError(res, {
        message: 'too_late_to_cancel',
        statusCode: 400,
        language: req.language,
      });
    }
    
    // Update booking
    booking.status = 'cancelled';
    booking.cancelled_at = new Date();
    booking.cancelled_by = isCustomer ? 'customer' : 'provider';
    booking.cancellation_category = cancellation_category || 'Other';
    booking.cancellation_reason = cancellation_reason || 'No reason provided';
    
    await booking.save();
    
    // Send notification to other party
    try {
      const customer = await User.findByPk(booking.user_id);
      const providerUser = await User.findByPk(booking.provider.user_id);
      
      const notificationService = NotificationFactory.getService();
      const otherPartyPhone = isCustomer ? providerUser?.phone : customer?.phone;
      
      if (otherPartyPhone) {
        const canceledBy = isCustomer ? 'customer' : 'provider';
        const message = `Booking ${booking.booking_number} has been cancelled by ${canceledBy}. Reason: ${cancellation_category || 'No reason'}`;
        
        if (typeof notificationService.sendSMS === 'function') {
          await notificationService.sendSMS(otherPartyPhone, message);
        } else {
          console.log(`Cancellation notification: ${message}`);
        }
      }
    } catch (notifError) {
      console.error('Failed to send cancellation notification:', notifError);
    }
    
    return sendSuccess(res, {
      message: 'booking_cancelled',
      language: req.language,
      data: { booking },
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

module.exports = {
  sendBookingOTP,
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  providerAcceptOrRejectBooking,
  cancelBooking,
};
