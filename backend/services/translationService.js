/**
 * Translation Service
 * Handles all translations for API responses and messages
 */

const translations = {
  en: {
    // Common messages
    success: 'Success',
    error: 'Error',
    not_found: 'Not found',
    unauthorized: 'Unauthorized',
    forbidden: 'Forbidden',
    validation_error: 'Validation error',
    server_error: 'Internal server error',
    invalid_credentials: 'Invalid credentials',
    user_not_found: 'User not found',
    resource_not_found: 'Resource not found',
    already_exists: 'Already exists',
    created_successfully: 'Created successfully',
    updated_successfully: 'Updated successfully',
    deleted_successfully: 'Deleted successfully',
    retrieved_successfully: 'Retrieved successfully',
    
    // Auth messages
    login_successful: 'Login successful',
    account_created: 'Account created successfully',
    account_verified: 'Account verified successfully',
    otp_sent: 'OTP sent successfully',
    otp_verified: 'OTP verified successfully',
    otp_invalid: 'Invalid or expired OTP',
    otp_required: 'OTP verification required to complete booking',
    phone_required: 'Phone number is required',
    password_changed: 'Password changed successfully',
    token_refreshed: 'Token refreshed successfully',
    profile_updated: 'Profile updated successfully',
    profile_retrieved: 'Profile retrieved successfully',
    phone_verification_required: 'Please verify your phone number',
    user_already_exists: 'User with this {field} already exists',
    user_not_found_signup: 'User not found. Please sign up first.',
    account_deactivated: 'Your account has been deactivated. Please contact support.',
    email_in_use: 'Email already in use',
    current_password_incorrect: 'Current password is incorrect',
    invalid_user: 'Invalid user',
    
    // Booking messages
    booking_created: 'Booking created successfully',
    booking_updated: 'Booking updated successfully',
    booking_cancelled: 'Booking cancelled successfully',
    booking_not_found: 'Booking not found',
    booking_status_updated: 'Booking status updated successfully',
    booking_retrieved: 'Booking retrieved successfully',
    booking_accepted: 'Booking accepted successfully',
    booking_rejected: 'Booking rejected',
    booking_already_processed: 'This booking has already been processed',
    booking_cannot_be_cancelled: 'This booking cannot be cancelled',
    too_late_to_cancel: 'It is too late to cancel this booking',
    booking_unauthorized: 'You are not authorized to view this booking',
    booking_unauthorized_update: 'You are not authorized to update this booking',
    booking_status_invalid: 'Invalid status transition from {current} to {new}',
    otp_sent: 'OTP sent successfully',
    otp_invalid: 'Invalid OTP',
    phone_required: 'Phone number is required',
    invalid_action: 'Invalid action. Must be accept or reject',
    booking_status_confirmed: 'Confirmed',
    booking_status_provider_on_way: 'Provider on the way',
    booking_status_provider_arrived: 'Provider arrived',
    booking_status_in_progress: 'In progress',
    booking_status_completed: 'Completed',
    booking_status_cancelled: 'Cancelled',
    booking_status_refunded: 'Refunded',
    
    // Service messages
    service_created: 'Service created successfully',
    service_updated: 'Service updated successfully',
    service_deleted: 'Service deleted successfully',
    service_not_found: 'Service not found',
    service_inactive: 'Service not found or inactive',
    service_unauthorized: 'Unauthorized to access this service',
    service_unauthorized_update: 'Unauthorized to update this service',
    service_unauthorized_delete: 'Unauthorized to delete this service',
    service_retrieved: 'Service retrieved successfully',
    services_retrieved: 'Services retrieved successfully',
    
    // Provider messages
    provider_created: 'Provider created successfully',
    provider_updated: 'Provider updated successfully',
    provider_not_found: 'Provider not found',
    provider_retrieved: 'Provider retrieved successfully',
    providers_retrieved: 'Providers retrieved successfully',
    provider_registration_submitted: 'Provider registration submitted successfully. Your application is under review.',
    provider_profile_not_found: 'Provider profile not found',
    provider_profile_updated: 'Provider profile updated successfully',
    provider_stats_retrieved: 'Provider statistics retrieved successfully',
    provider_not_approved: 'This provider profile is not available',
    provider_already_registered: 'You are already registered as a provider',
    provider_approved: 'Provider approved successfully',
    provider_rejected: 'Provider rejected successfully',
    provider_pending: 'Provider applications pending review',
    
    // Category messages
    category_created: 'Category created successfully',
    category_updated: 'Category updated successfully',
    category_deleted: 'Category deleted successfully',
    category_not_found: 'Category not found',
    category_retrieved: 'Category retrieved successfully',
    categories_retrieved: 'Categories retrieved successfully',
    category_search_completed: 'Category search completed successfully',
    category_search_no_results: 'No categories found matching your search',
    
    // Location messages
    cities_retrieved: 'Cities retrieved successfully',
    areas_retrieved: 'Areas retrieved successfully',
    city_not_found: 'City not found',
    area_not_found: 'Area not found',
    city_slug_required: 'City slug is required',
    area_does_not_belong: 'Area does not belong to the specified city',
    locations_searched: 'Locations searched successfully',
    
    // Rating messages
    rating_created: 'Rating submitted successfully',
    rating_updated: 'Rating updated successfully',
    rating_deleted: 'Rating deleted successfully',
    rating_not_found: 'Rating not found',
    rating_unauthorized: 'Unauthorized to rate this booking',
    rating_already_exists: 'This booking has already been rated',
    rating_only_completed: 'Can only rate completed bookings',
    
    // Search messages
    search_completed: 'Search completed successfully',
    search_suggestions: 'Search suggestions retrieved successfully',
    no_results: 'No results found',
    no_results_found: 'No matching services found. Please choose from the categories below.',
    search_placeholder: 'Search by service or task (e.g., clean sofa, fix light, mount TV)',
    
    // Admin messages
    admin_stats_retrieved: 'Admin statistics retrieved successfully',
    admin_unauthorized: 'Admin access required',
    provider_status_updated: 'Provider status updated successfully',
    customers_retrieved: 'Customers retrieved successfully',
    pending_providers_retrieved: 'Pending providers retrieved successfully',
    
    // File upload messages
    file_uploaded: 'File uploaded successfully',
    no_file_uploaded: 'No file uploaded',
    file_upload_error: 'Error uploading file',
    profile_image_updated: 'Profile image updated successfully',
    
    // Validation messages
    first_name_required: 'First name is required',
    phone_required: 'Phone number is required',
    email_required: 'Email is required',
    password_required: 'Password is required',
    invalid_email: 'Invalid email format',
    invalid_phone: 'Invalid phone number format',
    password_too_short: 'Password must be at least 6 characters',
    invalid_city_id: 'Invalid city_id provided',
    invalid_area_id: 'Invalid area_id provided',
    required_fields_missing: 'Required fields are missing',
    
    // Time and date formats
    expires_in: 'expires in',
    minutes: 'minutes',
    hours: 'hours',
    days: 'days',
    
    // Status messages
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    suspended: 'Suspended',
    
    // Payment messages
    payment_pending: 'Payment pending',
    payment_paid: 'Payment completed',
    payment_refunded: 'Payment refunded',
    
    // Notification messages
    new_booking_received: 'New booking received! {customerName} has booked "{serviceName}" for {bookingDateTime}. Booking #{bookingNumber}. Total: ${totalPrice}. Please check your dashboard for details.',
    booking_confirmation: 'Your booking #{bookingNumber} has been confirmed for {bookingDate} at {bookingTime}. Total: ${totalPrice}',
    booking_status_update: 'Your booking #{bookingNumber} status has been updated to {status}',
  },
  
  ar: {
    // Common messages
    success: 'نجح',
    error: 'خطأ',
    not_found: 'غير موجود',
    unauthorized: 'غير مصرح',
    forbidden: 'ممنوع',
    validation_error: 'خطأ في التحقق',
    server_error: 'خطأ في الخادم',
    invalid_credentials: 'بيانات اعتماد غير صحيحة',
    user_not_found: 'المستخدم غير موجود',
    resource_not_found: 'المورد غير موجود',
    already_exists: 'موجود بالفعل',
    created_successfully: 'تم الإنشاء بنجاح',
    updated_successfully: 'تم التحديث بنجاح',
    deleted_successfully: 'تم الحذف بنجاح',
    retrieved_successfully: 'تم الاسترجاع بنجاح',
    
    // Auth messages
    login_successful: 'تم تسجيل الدخول بنجاح',
    account_created: 'تم إنشاء الحساب بنجاح',
    account_verified: 'تم التحقق من الحساب بنجاح',
    otp_sent: 'تم إرسال رمز التحقق بنجاح',
    otp_verified: 'تم التحقق من الرمز بنجاح',
    otp_invalid: 'رمز التحقق غير صحيح أو منتهي الصلاحية',
    otp_required: 'التحقق من رمز OTP مطلوب لإكمال الحجز',
    phone_required: 'رقم الهاتف مطلوب',
    password_changed: 'تم تغيير كلمة المرور بنجاح',
    token_refreshed: 'تم تحديث الرمز المميز بنجاح',
    profile_updated: 'تم تحديث الملف الشخصي بنجاح',
    profile_retrieved: 'تم استرجاع الملف الشخصي بنجاح',
    phone_verification_required: 'يرجى التحقق من رقم الهاتف',
    user_already_exists: 'المستخدم بهذا {field} موجود بالفعل',
    user_not_found_signup: 'المستخدم غير موجود. يرجى التسجيل أولاً.',
    account_deactivated: 'تم إلغاء تفعيل حسابك. يرجى الاتصال بالدعم.',
    email_in_use: 'البريد الإلكتروني مستخدم بالفعل',
    current_password_incorrect: 'كلمة المرور الحالية غير صحيحة',
    invalid_user: 'مستخدم غير صحيح',
    
    // Booking messages
    booking_created: 'تم إنشاء الحجز بنجاح',
    booking_updated: 'تم تحديث الحجز بنجاح',
    booking_cancelled: 'تم إلغاء الحجز بنجاح',
    booking_not_found: 'الحجز غير موجود',
    booking_status_updated: 'تم تحديث حالة الحجز بنجاح',
    booking_retrieved: 'تم استرجاع الحجز بنجاح',
    booking_accepted: 'تم قبول الحجز بنجاح',
    booking_rejected: 'تم رفض الحجز',
    booking_already_processed: 'تمت معالجة هذا الحجز بالفعل',
    booking_cannot_be_cancelled: 'لا يمكن إلغاء هذا الحجز',
    too_late_to_cancel: 'لقد فات الأوان لإلغاء هذا الحجز',
    booking_unauthorized: 'غير مصرح لك بعرض هذا الحجز',
    booking_unauthorized_update: 'غير مصرح لك بتحديث هذا الحجز',
    booking_status_invalid: 'انتقال حالة غير صالح من {current} إلى {new}',
    otp_sent: 'تم إرسال الرمز بنجاح',
    otp_invalid: 'رمز غير صحيح',
    phone_required: 'رقم الهاتف مطلوب',
    invalid_action: 'إجراء غير صحيح. يجب أن يكون قبول أو رفض',
    booking_status_confirmed: 'مؤكد',
    booking_status_provider_on_way: 'مقدم الخدمة في الطريق',
    booking_status_provider_arrived: 'وصل مقدم الخدمة',
    booking_status_in_progress: 'قيد التنفيذ',
    booking_status_completed: 'مكتمل',
    booking_status_cancelled: 'ملغي',
    booking_status_refunded: 'مسترد',
    
    // Service messages
    service_created: 'تم إنشاء الخدمة بنجاح',
    service_updated: 'تم تحديث الخدمة بنجاح',
    service_deleted: 'تم حذف الخدمة بنجاح',
    service_not_found: 'الخدمة غير موجودة',
    service_inactive: 'الخدمة غير موجودة أو غير نشطة',
    service_unauthorized: 'غير مصرح بالوصول إلى هذه الخدمة',
    service_unauthorized_update: 'غير مصرح بتحديث هذه الخدمة',
    service_unauthorized_delete: 'غير مصرح بحذف هذه الخدمة',
    service_retrieved: 'تم استرجاع الخدمة بنجاح',
    services_retrieved: 'تم استرجاع الخدمات بنجاح',
    
    // Provider messages
    provider_created: 'تم إنشاء مقدم الخدمة بنجاح',
    provider_updated: 'تم تحديث مقدم الخدمة بنجاح',
    provider_not_found: 'مقدم الخدمة غير موجود',
    provider_retrieved: 'تم استرجاع مقدم الخدمة بنجاح',
    providers_retrieved: 'تم استرجاع مقدمي الخدمة بنجاح',
    provider_registration_submitted: 'تم تقديم طلب تسجيل مقدم الخدمة بنجاح. طلبك قيد المراجعة.',
    provider_profile_not_found: 'ملف مقدم الخدمة غير موجود',
    provider_profile_updated: 'تم تحديث ملف مقدم الخدمة بنجاح',
    provider_stats_retrieved: 'تم استرجاع إحصائيات مقدم الخدمة بنجاح',
    provider_not_approved: 'ملف مقدم الخدمة هذا غير متاح',
    provider_already_registered: 'أنت مسجل بالفعل كمقدم خدمة',
    provider_approved: 'تم الموافقة على مقدم الخدمة بنجاح',
    provider_rejected: 'تم رفض مقدم الخدمة بنجاح',
    provider_pending: 'طلبات مقدمي الخدمة في انتظار المراجعة',
    
    // Category messages
    category_created: 'تم إنشاء الفئة بنجاح',
    category_updated: 'تم تحديث الفئة بنجاح',
    category_deleted: 'تم حذف الفئة بنجاح',
    category_not_found: 'الفئة غير موجودة',
    category_retrieved: 'تم استرجاع الفئة بنجاح',
    categories_retrieved: 'تم استرجاع الفئات بنجاح',
    category_search_completed: 'تم البحث في الفئات بنجاح',
    category_search_no_results: 'لم يتم العثور على فئات تطابق بحثك',
    
    // Location messages
    cities_retrieved: 'تم استرجاع المدن بنجاح',
    areas_retrieved: 'تم استرجاع المناطق بنجاح',
    city_not_found: 'المدينة غير موجودة',
    area_not_found: 'المنطقة غير موجودة',
    city_slug_required: 'معرف المدينة مطلوب',
    area_does_not_belong: 'المنطقة لا تنتمي إلى المدينة المحددة',
    locations_searched: 'تم البحث في المواقع بنجاح',
    
    // Rating messages
    rating_created: 'تم تقديم التقييم بنجاح',
    rating_updated: 'تم تحديث التقييم بنجاح',
    rating_deleted: 'تم حذف التقييم بنجاح',
    rating_not_found: 'التقييم غير موجود',
    rating_unauthorized: 'غير مصرح بتقييم هذا الحجز',
    rating_already_exists: 'تم تقييم هذا الحجز بالفعل',
    rating_only_completed: 'يمكن تقييم الحجوزات المكتملة فقط',
    
    // Search messages
    search_completed: 'تم البحث بنجاح',
    search_suggestions: 'تم استرجاع اقتراحات البحث بنجاح',
    no_results: 'لا توجد نتائج',
    no_results_found: 'لا يوجد تطابق. الرجاء اختيار فئة من الأسفل.',
    search_placeholder: 'ابحث باسم الخدمة أو المهمة (مثال: تنظيف كنبة، تصليح ضَو، تركيب تلفزيون)',
    
    // Admin messages
    admin_stats_retrieved: 'تم استرجاع إحصائيات الإدارة بنجاح',
    admin_unauthorized: 'مطلوب وصول الإدارة',
    provider_status_updated: 'تم تحديث حالة مقدم الخدمة بنجاح',
    customers_retrieved: 'تم استرجاع العملاء بنجاح',
    pending_providers_retrieved: 'تم استرجاع مقدمي الخدمة المعلقين بنجاح',
    
    // File upload messages
    file_uploaded: 'تم رفع الملف بنجاح',
    no_file_uploaded: 'لم يتم رفع أي ملف',
    file_upload_error: 'خطأ في رفع الملف',
    profile_image_updated: 'تم تحديث صورة الملف الشخصي بنجاح',
    
    // Validation messages
    first_name_required: 'الاسم الأول مطلوب',
    phone_required: 'رقم الهاتف مطلوب',
    email_required: 'البريد الإلكتروني مطلوب',
    password_required: 'كلمة المرور مطلوبة',
    invalid_email: 'تنسيق البريد الإلكتروني غير صحيح',
    invalid_phone: 'تنسيق رقم الهاتف غير صحيح',
    password_too_short: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
    invalid_city_id: 'معرف المدينة غير صحيح',
    invalid_area_id: 'معرف المنطقة غير صحيح',
    required_fields_missing: 'الحقول المطلوبة مفقودة',
    
    // Time and date formats
    expires_in: 'ينتهي خلال',
    minutes: 'دقائق',
    hours: 'ساعات',
    days: 'أيام',
    
    // Status messages
    active: 'نشط',
    inactive: 'غير نشط',
    pending: 'في الانتظار',
    approved: 'موافق عليه',
    rejected: 'مرفوض',
    suspended: 'معلق',
    
    // Payment messages
    payment_pending: 'الدفع معلق',
    payment_paid: 'تم الدفع',
    payment_refunded: 'تم استرداد الدفع',
    
    // Notification messages
    new_booking_received: 'تم استلام حجز جديد! {customerName} حجز "{serviceName}" في {bookingDateTime}. رقم الحجز #{bookingNumber}. الإجمالي: ${totalPrice}. يرجى مراجعة لوحة التحكم للتفاصيل.',
    booking_confirmation: 'تم تأكيد حجزك #{bookingNumber} في {bookingDate} الساعة {bookingTime}. الإجمالي: ${totalPrice}',
    booking_status_update: 'تم تحديث حالة حجزك #{bookingNumber} إلى {status}',
  }
};

/**
 * Get translation for a key
 * @param {string} key - Translation key
 * @param {string} language - Language code ('en' or 'ar')
 * @param {Object} variables - Variables to replace in translation
 * @returns {string} Translated text
 */
const translate = (key, language = 'en', variables = {}) => {
  const lang = language || 'en';
  const translation = translations[lang]?.[key] || translations['en'][key] || key;
  
  // Replace variables in translation
  let result = translation;
  Object.keys(variables).forEach(variable => {
    const placeholder = `{${variable}}`;
    result = result.replace(new RegExp(placeholder, 'g'), variables[variable]);
  });
  
  return result;
};

/**
 * Get multiple translations at once
 * @param {Array} keys - Array of translation keys
 * @param {string} language - Language code ('en' or 'ar')
 * @param {Object} variables - Variables to replace in translations
 * @returns {Object} Object with translated keys
 */
const translateMultiple = (keys, language = 'en', variables = {}) => {
  const result = {};
  keys.forEach(key => {
    result[key] = translate(key, language, variables);
  });
  return result;
};

/**
 * Get all translations for a language
 * @param {string} language - Language code ('en' or 'ar')
 * @returns {Object} All translations for the language
 */
const getAllTranslations = (language = 'en') => {
  return translations[language] || translations['en'];
};

/**
 * Check if a translation key exists
 * @param {string} key - Translation key
 * @param {string} language - Language code ('en' or 'ar')
 * @returns {boolean} True if key exists
 */
const hasTranslation = (key, language = 'en') => {
  return !!(translations[language]?.[key] || translations['en'][key]);
};

/**
 * Get supported languages
 * @returns {Array} Array of supported language codes
 */
const getSupportedLanguages = () => {
  return Object.keys(translations);
};

module.exports = {
  translate,
  translateMultiple,
  getAllTranslations,
  hasTranslation,
  getSupportedLanguages,
  translations,
};

