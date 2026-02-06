import React, { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, Notification, IconArrowRight, Card } from 'hds-react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../App-context';
import api from '../common/utils/api/api';
import { Language, Resource } from '../common/lib/types';
import sessionStorage from '../common/utils/storage/sessionStorage';
import Collapse from '../components/collapse/Collapse';
import { Link } from '../components/link/Link';
import ResourceOpeningHours from '../components/resource-opening-hours/ResourceOpeningHours';
import { TargetResourcesProps } from '../components/resource-opening-hours/ResourcePeriodsCopyFieldset';
import './ResourcePage.scss';
import ResourceTitle from '../components/resource-title/ResourceTitle';
import { PrimaryButton } from '../components/button/Button';
import useGoToResourceBatchUpdatePage from '../hooks/useGoToResourceBatchUpdatePage';
import displayLangVersionNotFound from '../common/utils/language/displayLangVersionNotFound';
import {
  DatePeriodSelectState,
  useSelectedDatePeriodsContext,
} from '../common/selectedDatePeriodsContext/SelectedDatePeriodsContext';

const ResourceSection = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}): JSX.Element => (
  <section id={id} className="resource-details-section">
    {children}
  </section>
);

const ResourceDetailsSection = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}): JSX.Element => (
  <ResourceSection id={id}>
    <Collapse isOpen collapseContentId={`${id}-section`} title={title}>
      {children}
    </Collapse>
  </ResourceSection>
);

const ResourcePage = ({
  targetResourcesString,
}: {
  targetResourcesString?: string;
}): JSX.Element => {
  const { language: contextLanguage } = useAppContext();
  const language = contextLanguage || Language.FI;
  const [resource, setResource] = useState<Resource | undefined>(undefined);
  const [childResources, setChildResources] = useState<Resource[]>([]);
  const [parentResources, setParentResources] = useState<Resource[]>([]);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [targetResourceData, setTargetResourceData] = useState<
    TargetResourcesProps | undefined
  >(undefined);
  const [errorWhenNothingSelected, setErrorWhenNothingSelected] =
    useState<boolean>(false);

  const { id: mainResourceId, childId } = useParams<{
    id: string;
    childId?: string;
  }>();

  const targetResourcesStorageKey = 'targetResources';
  const goToResourceBatchUpdatePage = useGoToResourceBatchUpdatePage();
  const {
    selectedDatePeriods,
    setDatePeriodSelectState,
    datePeriodSelectState,
  } = useSelectedDatePeriodsContext();
  const { t } = useTranslation();

  const hasTargetResources =
    targetResourceData?.mainResourceId === resource?.id &&
    targetResourceData?.targetResources &&
    targetResourceData?.targetResources.length > 0;

  useEffect(() => {
    if (
      hasTargetResources &&
      datePeriodSelectState !== DatePeriodSelectState.ACTIVE
    ) {
      setDatePeriodSelectState(DatePeriodSelectState.ACTIVE);
    }
  }, [hasTargetResources, datePeriodSelectState, setDatePeriodSelectState]);

  useEffect(() => {
    if (resource) {
      if (targetResourcesString) {
        const targetResourceIDs = targetResourcesString.split(',');
        const newData = {
          mainResourceId: resource.id,
          mainResourceName: resource?.name[language] || resource?.name?.fi,
          targetResources: targetResourceIDs.map((id) => ({
            id,
            name: '',
          })),
        };
        setTargetResourceData(newData);
        sessionStorage.storeItem<TargetResourcesProps>({
          key: targetResourcesStorageKey,
          value: newData,
        });
      } else {
        const oldData = sessionStorage.getItem<TargetResourcesProps>(
          targetResourcesStorageKey
        );
        if (oldData) {
          if (oldData.mainResourceId === resource?.id) {
            setTargetResourceData(oldData);
          } else {
            sessionStorage.removeItem(targetResourcesStorageKey);
          }
        }
      }
    }
  }, [language, resource, targetResourcesString]);

  useEffect(() => {
    let isMounted = true;

    // UseEffect's callbacks are synchronous to prevent a race condition.
    // We can not use an async function as an useEffect's callback because it would return Promise<void>
    if (mainResourceId) {
      api
        .getResource(mainResourceId)
        .then(async (r: Resource) => {
          if (!isMounted) return;

          setResource(r);
          const resourceHasChildren = r.children.length > 0;
          const resourceHasParents = r.parents.length > 0;

          if (resourceHasChildren || resourceHasParents) {
            // fetch children and parents
            const [childR, parentR] = await Promise.all([
              resourceHasChildren ? api.getChildResourcesByParentId(r.id) : [],
              resourceHasParents ? api.getParentResourcesByChildId(r.id) : [],
            ]);

            setChildResources(childR);
            setParentResources(parentR);
          }
          setLoading(false);
        })
        .catch((e: Error) => {
          setError(e);
          setLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [mainResourceId]);

  const gotoBatchUpdatePage = (): void => {
    if (selectedDatePeriods.length === 0) {
      setErrorWhenNothingSelected(true);
    } else {
      goToResourceBatchUpdatePage();
    }
  };

  if (error) {
    return (
      <>
        <h1 className="resource-info-title">
          {t('ResourcePage.Notifications.Error')}
        </h1>
        <Notification
          label={t('ResourcePage.Notifications.ErrorLoadingResource')}
          type="error">
          {t('ResourcePage.Notifications.CheckResourceId')}
        </Notification>
      </>
    );
  }

  if (isLoading || !resource) {
    return (
      <>
        <h1 className="resource-info-title">
          {t('ResourcePage.Notifications.IsLoading')}
        </h1>
      </>
    );
  }

  return (
    <div className="resource-page">
      <ResourceTitle resource={resource} language={language} />
      {childResources.length > 0 && (
        <p className="resource-child-resources-description">
          {t('ResourcePage.Main.Description', {
            childResourceCount: childResources.length,
          })}
        </p>
      )}
      {hasTargetResources && (
        <Card
          border
          heading={t('ResourcePage.Main.BatchTitle', {
            targetResourceCount: targetResourceData?.targetResources?.length,
          })}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
          text={t('ResourcePage.Main.BatchDescription')}>
          <PrimaryButton
            dataTest="gotoBatchUpdateButton"
            iconRight={<IconArrowRight aria-hidden />}
            onClick={gotoBatchUpdatePage}>
            {t('ResourcePage.Main.BatchContinueButton')}
          </PrimaryButton>
          {errorWhenNothingSelected && (
            <div>
              <Notification
                dataTestId="gotoBatchUpdateErrorNotification"
                label={t('ResourcePage.Notifications.ErrorNothingSelected')}
                type="error"
                size="small"
                style={{
                  marginTop: 'var(--spacing-m)',
                }}>
                {t('ResourcePage.Notifications.ErrorNothingSelected')}
              </Notification>
            </div>
          )}
        </Card>
      )}
      {!hasTargetResources && parentResources?.length > 0 && (
        <ResourceDetailsSection
          id="parent-resource-description"
          title={t('ResourcePage.Main.Resources')}>
          <p
            data-testid="parent-resource-description"
            className="resource-description-text">
            {t('ResourcePage.Main.ParentResourceDescription')}
          </p>
          {parentResources?.map((parentResource, index) => (
            <div className="related-resource-list-item" key={parentResource.id}>
              <Link
                dataTest={`parent-resource-name-${index}`}
                href={`/resource/${parentResource.id}`}
                text={
                  parentResource?.name[language] ||
                  parentResource?.name?.fi ||
                  displayLangVersionNotFound({
                    language,
                    label: 'toimipisteen nimi',
                  })
                }
              />
            </div>
          ))}
        </ResourceDetailsSection>
      )}
      <ResourceSection id="resource-opening-hours">
        {resource && (
          <ResourceOpeningHours language={language} resource={resource} />
        )}
      </ResourceSection>
      {!hasTargetResources && childResources?.length > 0 && (
        <>
          <section>
            <h2 className="child-resources-title">
              {t('ResourcePage.Main.ChildTitle')}
            </h2>
            <p
              data-testid="child-resource-description"
              className="resource-description-text">
              {t('ResourcePage.Main.ChildDescription')}
            </p>
          </section>
          <section>
            {childResources?.map((childResource) => (
              <Accordion
                key={childResource.id}
                initiallyOpen={childId === `${childResource.id}`}
                language={language}
                heading={
                  childResource?.name[language] ||
                  childResource?.name?.fi ||
                  displayLangVersionNotFound({
                    language,
                    label: 'alakohteen nimi',
                  })
                }>
                <ResourceOpeningHours
                  language={language}
                  parentId={resource.id}
                  resource={childResource}
                />
              </Accordion>
            ))}
          </section>
        </>
      )}
      <section className="past-opening-hours-link-section">
        <Link
          href={`/resource/${
            mainResourceId && childId
              ? `${mainResourceId}/child/${childId}`
              : mainResourceId
          }/past`}
          text={t('ResourcePage.Main.ViewPastOpeningHours')}
          dataTest="view-past-opening-hours-link"
        />
        <IconArrowRight aria-hidden className="past-opening-hours-arrow" />
      </section>
    </div>
  );
};

export default ResourcePage;
