import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Row = ({ label, value }) => (
  <div className="flex justify-between py-2">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const AdminProviderDocuments = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getProviderDocuments(id);
      setProvider(res.data?.data?.provider || null);
    } catch (err) {
      console.error(err);
      toast.error(t('admin.providerDocuments.loadError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateVerification = async (data) => {
    try {
      setUpdating(true);
      await adminAPI.updateProviderVerification(id, data);
      toast.success(t('admin.providerDocuments.success'));
      await loadDocuments();
    } catch (err) {
      console.error(err);
      toast.error(t('admin.providerDocuments.error'));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="container-custom py-8">{t('admin.providerDocuments.loading')}</div>;
  if (!provider) return <div className="container-custom py-8">{t('admin.providerDocuments.notFound')}</div>;

  return (
    <div className="container-custom py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{provider.business_name}</h1>
          <p className="text-gray-600">{t('admin.providerDocuments.owner')}: {provider.user?.first_name} {provider.user?.last_name} • {provider.user?.email}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${provider.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {provider.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold mb-4">{t('admin.providerDocuments.documents')}</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 mb-1">{t('admin.providerDocuments.idVerifiedImage')}</div>
              {provider.id_verified_image ? (
                <a className="text-blue-600 hover:underline" href={provider.id_verified_image} target="_blank" rel="noreferrer">{t('admin.providerDocuments.open')}</a>
              ) : (
                <span className="text-gray-500">{t('admin.providerDocuments.notUploaded')}</span>
              )}
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">{t('admin.providerDocuments.vocationalLicense')}</div>
              {provider.vocational_license_image ? (
                <a className="text-blue-600 hover:underline" href={provider.vocational_license_image} target="_blank" rel="noreferrer">{t('admin.providerDocuments.open')}</a>
              ) : (
                <span className="text-gray-500">{t('admin.providerDocuments.notUploaded')}</span>
              )}
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">{t('admin.providerDocuments.policeClearance')}</div>
              {provider.police_clearance_image ? (
                <a className="text-blue-600 hover:underline" href={provider.police_clearance_image} target="_blank" rel="noreferrer">{t('admin.providerDocuments.open')}</a>
              ) : (
                <span className="text-gray-500">{t('admin.providerDocuments.notUploaded')}</span>
              )}
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-4">{t('admin.providerDocuments.verificationStatus')}</h2>
          <Row label={t('admin.providerDocuments.idVerified')} value={provider.is_id_verified ? t('admin.customers.yes') : t('admin.customers.no')} />
          <Row label={t('admin.providerDocuments.licenseVerified')} value={provider.is_license_verified ? t('admin.customers.yes') : t('admin.customers.no')} />
          <Row label={t('admin.providerDocuments.policeClearanceVerified')} value={provider.is_police_clearance_verified ? t('admin.customers.yes') : t('admin.customers.no')} />

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            <button disabled={updating} onClick={() => updateVerification({ is_id_verified: true })} className="btn-primary">{t('admin.providerDocuments.approveId')}</button>
            <button disabled={updating} onClick={() => updateVerification({ is_license_verified: true })} className="btn-secondary">{t('admin.providerDocuments.approveLicense')}</button>
            <button disabled={updating} onClick={() => updateVerification({ is_police_clearance_verified: true })} className="btn-secondary">{t('admin.providerDocuments.approvePolice')}</button>
            <button disabled={updating} onClick={() => updateVerification({ is_id_verified: true, is_license_verified: true, is_police_clearance_verified: true })} className="btn-secondary">{t('admin.providerDocuments.approveAll')}</button>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-4">{t('admin.providerDocuments.profile')}</h2>
          <Row label={t('admin.providerDocuments.hourlyRate')} value={`${provider.hourly_rate ?? '-'}`} />
          <Row label={t('admin.providerDocuments.experienceYears')} value={`${provider.experience_years ?? '-'}`} />
          <Row label={t('admin.providerDocuments.appliedAt')} value={provider.created_at ? new Date(provider.created_at).toLocaleString() : '-'} />
        </div>
      </div>

      <div>
        <a href="/admin/providers" className="text-blue-600 hover:underline">{t('admin.providerDocuments.backToProviders')}</a>
      </div>
    </div>
  );
};

export default AdminProviderDocuments;


