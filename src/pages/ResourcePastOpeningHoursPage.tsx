import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Notification } from 'hds-react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../App-context';
import api from '../common/utils/api/api';
import { Language, Resource } from '../common/lib/types';
import displayLangVersionNotFound from '../common/utils/language/displayLangVersionNotFound';
import './ResourcePastOpeningHoursPage.scss';

const ResourcePastOpeningHoursPage = (): JSX.Element => {
  const { language: contextLanguage } = useAppContext();
  const language = contextLanguage || Language.FI;
  const { t } = useTranslation();
  const [resource, setResource] = useState<Resource | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setLoading] = useState<boolean>(true);

  const { id } = useParams<{
    id: string;
    parentId?: string;
  }>();

  const resourceId = id;

  useEffect(() => {
    let isMounted = true;

    if (resourceId) {
      api
        .getResource(resourceId)
        .then((r: Resource) => {
          if (!isMounted) return;
          setResource(r);
          setLoading(false);
        })
        .catch((e: Error) => {
          if (!isMounted) return;
          setError(e);
          setLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [resourceId]);

  if (error) {
    return (
      <>
        <h1 className="past-opening-hours-title">
          {t('ResourcePastOpeningHoursPage.Notifications.Error')}
        </h1>
        <Notification
          label={t(
            'ResourcePastOpeningHoursPage.Notifications.ErrorLoadingResource'
          )}
          type="error">
          {t('ResourcePastOpeningHoursPage.Notifications.CheckResourceId')}
        </Notification>
      </>
    );
  }

  if (isLoading || !resource) {
    return (
      <>
        <h1 className="past-opening-hours-title">
          {t('ResourcePastOpeningHoursPage.Notifications.IsLoading')}
        </h1>
      </>
    );
  }

  const resourceName =
    resource?.name[language] ||
    resource?.name?.fi ||
    displayLangVersionNotFound({
      language,
      label: 'resurssille',
    });

  return (
    <div className="resource-past-opening-hours-page">
      <h1 className="past-opening-hours-title">
        {resourceName}, {t('ResourcePastOpeningHoursPage.Main.Title')}
      </h1>

      <section className="past-opening-hours-content">
        <p>{t('ResourcePastOpeningHoursPage.Main.PlaceholderText')}</p>
        {/* TODO: Implement past opening hours content */}
      </section>
    </div>
  );
};

export default ResourcePastOpeningHoursPage;
