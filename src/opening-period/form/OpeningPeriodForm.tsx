import React, { useEffect } from 'react';
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { IconPlus, IconTrash, Notification, DateInput } from 'hds-react';
import {
  DatePeriod,
  Language,
  LanguageStrings,
  OpeningPeriodFormData,
  ResourceState,
  TimeSpanGroupFormFormat,
  UiDatePeriodConfig,
  UiFieldConfig,
  UiFormRuleConfig,
} from '../../common/lib/types';
import { isDateBefore } from '../../common/utils/date-time/compare';
import {
  formatDate,
  parseFormDate,
  transformDateToApiFormat,
} from '../../common/utils/date-time/format';
import {
  PrimaryButton,
  SecondaryButton,
  SupplementaryButton,
} from '../../components/button/Button';
import {
  ErrorText,
  NotificationText,
} from '../../components/icon-text/IconText';
import ResourceStateSelect from '../../components/resourse-state-select/ResourceStateSelect';
import toast from '../../components/notification/Toast';
import {
  formatTimeSpanGroupsToApiFormat,
  formatTimeSpanGroupsToFormFormat,
} from './form-helpers/form-helpers';
import OpeningPeriodDescription from '../description/OpeningPeriodDescription';
import TimeSpans from '../time-span/TimeSpans';
import Rules from '../rule/Rules';
import './OpeningPeriodForm.scss';
import { MainContainer } from '../../components/main/Main';

const defaultTimeSpanGroup: TimeSpanGroupFormFormat = {
  timeSpans: [],
  rules: [],
};

type NotificationTexts = {
  label: string;
  text: string;
};

export type OpeningPeriodFormProps = {
  formId: string;
  datePeriod?: DatePeriod;
  forceException?: boolean;
  resourceId: number;
  datePeriodConfig: UiDatePeriodConfig;
  submitFn: (datePeriod: DatePeriod) => Promise<DatePeriod>;
  successTextAndLabel: NotificationTexts;
  errorTextAndLabel: NotificationTexts;
};

const validateEndInputWithStartDate = (
  start: string | null,
  end: string | null
): boolean | string => {
  if (!start || !end) {
    return true;
  }

  if (isDateBefore(parseFormDate(end), parseFormDate(start))) {
    return 'Aukiolojakson loppupäivämäärä ei voi olla ennen alkupäivämäärää.';
  }

  return true;
};

const isResourceStateSet = (state?: ResourceState): boolean =>
  !!state && state !== ResourceState.UNDEFINED;

const emptyLanguages: LanguageStrings = {
  fi: null,
  sv: null,
  en: null,
};

export default function OpeningPeriodForm({
  formId,
  datePeriod,
  forceException = false,
  resourceId,
  datePeriodConfig,
  submitFn,
  successTextAndLabel,
  errorTextAndLabel,
}: OpeningPeriodFormProps): JSX.Element {
  const language = Language.FI;

  const nameFieldConfig = datePeriodConfig.name;

  const resourceStateConfig: UiFieldConfig = {
    options: datePeriodConfig.resourceState.options.map(
      (translatedApiChoice) => ({
        value: translatedApiChoice.value,
        label: translatedApiChoice.label[language] as string,
      })
    ),
  };

  const ruleConfig: UiFormRuleConfig = {
    context: {
      required: datePeriodConfig.timeSpanGroup.rule.context.required,
      options: datePeriodConfig.timeSpanGroup.rule.context.options.map(
        (translatedApiChoice) => ({
          value: translatedApiChoice.value,
          label: translatedApiChoice.label[language] as string,
        })
      ),
    },
    subject: {
      required: datePeriodConfig.timeSpanGroup.rule.subject.required,
      options: datePeriodConfig.timeSpanGroup.rule.subject.options.map(
        (translatedApiChoice) => ({
          value: translatedApiChoice.value,
          label: translatedApiChoice.label[language] as string,
        })
      ),
    },
    frequencyModifier: {
      required: datePeriodConfig.timeSpanGroup.rule.frequencyModifier.required,
      options: datePeriodConfig.timeSpanGroup.rule.frequencyModifier.options.map(
        (translatedApiChoice) => ({
          value: translatedApiChoice.value,
          label: translatedApiChoice.label[language] as string,
        })
      ),
    },
    start: {
      required: datePeriodConfig.timeSpanGroup.rule.start.required,
    },
  };

  const openingPeriodResourceStateKey = 'openingPeriodResourceState';

  const formValues: OpeningPeriodFormData = {
    openingPeriodTitle: datePeriod?.name || emptyLanguages,
    openingPeriodOptionalDescription: datePeriod?.description || emptyLanguages,
    openingPeriodBeginDate: datePeriod?.start_date
      ? formatDate(datePeriod?.start_date)
      : null,
    openingPeriodEndDate: datePeriod?.end_date
      ? formatDate(datePeriod?.end_date)
      : null,
    openingPeriodResourceState: datePeriod?.resource_state,
    timeSpanGroups: [defaultTimeSpanGroup],
  };

  const formMethods = useForm<OpeningPeriodFormData>({
    mode: 'onBlur',
    defaultValues: formValues,
    shouldUnregister: true,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    control,
    setValue,
    getValues,
    watch,
    trigger,
  } = formMethods;

  const clearResourceState = (): void => {
    setValue(openingPeriodResourceStateKey, ResourceState.UNDEFINED);
  };

  const resourceStateValue = watch(openingPeriodResourceStateKey);

  const timeSpanGroupFieldName = 'timeSpanGroups';

  const {
    fields: timeSpanGroupFields,
    append: appendTimeSpanGroup,
    remove: removeTimeSpanGroup,
  } = useFieldArray({
    control,
    keyName: 'timeSpanGroupUiId',
    name: timeSpanGroupFieldName,
  });

  const history = useHistory();

  const returnToResourcePage = (): void =>
    history.push(`/resource/${resourceId}`);

  const onSubmit = async (data: OpeningPeriodFormData): Promise<void> => {
    await trigger('openingPeriodEndDate'); // Validate the end date before sending the form, in case the user changed only the beginning date.

    try {
      const dataAsDatePeriod: DatePeriod = {
        ...(datePeriod?.id ? { id: datePeriod.id } : {}),
        resource: resourceId,
        name: data.openingPeriodTitle,
        description: data.openingPeriodOptionalDescription,
        start_date: data.openingPeriodBeginDate
          ? transformDateToApiFormat(data.openingPeriodBeginDate)
          : null,
        end_date: data.openingPeriodEndDate
          ? transformDateToApiFormat(data.openingPeriodEndDate)
          : null,
        resource_state: data.openingPeriodResourceState,
        override: forceException || datePeriod?.override || false,
        time_span_groups: isResourceStateSet(data?.openingPeriodResourceState)
          ? []
          : formatTimeSpanGroupsToApiFormat(data.timeSpanGroups),
      };
      const updatedPeriod = await submitFn(dataAsDatePeriod);
      if (updatedPeriod) {
        toast.success({
          dataTestId: 'opening-period-form-success',
          label: successTextAndLabel.label,
          text: successTextAndLabel.text,
        });
        returnToResourcePage();
      }
    } catch (err) {
      toast.error({
        dataTestId: 'opening-period-form-error',
        label: errorTextAndLabel.label,
        text: errorTextAndLabel.text,
      });
      // eslint-disable-next-line no-console
      console.error(err); // For debug purposes
    }
  };

  useEffect(() => {
    if (datePeriod) {
      setValue(
        'timeSpanGroups',
        datePeriod?.time_span_groups && datePeriod?.time_span_groups.length
          ? formatTimeSpanGroupsToFormFormat(datePeriod.time_span_groups)
          : [defaultTimeSpanGroup]
      );
    }
  }, [datePeriod, language, setValue]);

  return (
    <FormProvider {...formMethods}>
      <form
        id={formId}
        data-test={formId}
        className="opening-period-form"
        onSubmit={handleSubmit(onSubmit)}>
        <section className="form-section">
          <OpeningPeriodDescription
            register={register}
            errors={errors}
            getValues={getValues}
            clearErrors={clearErrors}
            nameFieldConfig={nameFieldConfig}
          />
        </section>
        <div className="form-multiple-sections-row">
          <section className="form-section">
            <h3 className="opening-period-section-title">Ajanjakso</h3>
            <div className="form-control">
              <section className="opening-period-time-period">
                <Controller
                  name="openingPeriodBeginDate"
                  render={({ field: { name, onBlur, onChange, value } }) => (
                    <DateInput
                      id="openingPeriodBeginDate"
                      data-test="openingPeriodBeginDate"
                      className="opening-period-date-picker opening-period-start-date-picker"
                      initialMonth={new Date()}
                      label="Alkaa"
                      openButtonAriaLabel="Valitse alkupäivämäärä"
                      language="fi"
                      value={value}
                      name={name}
                      onBlur={onBlur}
                      onChange={onChange}
                      disableConfirmation
                    />
                  )}
                />
                <p className="dash-between-begin-and-end-date">—</p>
                <Controller
                  name="openingPeriodEndDate"
                  render={({ field: { name, onBlur, onChange, value } }) => (
                    <DateInput
                      id="openingPeriodEndDate"
                      data-test="openingPeriodEndDate"
                      className="opening-period-date-picker"
                      initialMonth={new Date()}
                      label="Päättyy"
                      openButtonAriaLabel="Valitse loppupäivämäärä"
                      language="fi"
                      value={value}
                      invalid={!!errors.openingPeriodEndDate?.message}
                      aria-describedby="opening-period-date-error-text"
                      name={name}
                      onBlur={onBlur}
                      onChange={onChange}
                      disableConfirmation
                    />
                  )}
                  rules={{
                    validate: (value) =>
                      validateEndInputWithStartDate(
                        getValues()?.openingPeriodBeginDate,
                        value
                      ),
                  }}
                />
              </section>
              {errors.openingPeriodEndDate?.type === 'validate' &&
                errors.openingPeriodEndDate?.message && (
                  <ErrorText
                    id="opening-period-date-error-text"
                    message={errors.openingPeriodEndDate.message}
                  />
                )}
            </div>
          </section>
          <section className="form-section">
            <h3 className="opening-period-section-title">
              Jakson tila (valinnainen)
            </h3>
            <div className="form-control">
              <div className="form-actions-row opening-period-resource-state">
                <ResourceStateSelect
                  control={control}
                  name={openingPeriodResourceStateKey}
                  id="opening-period-resource-state"
                  value={datePeriod?.resource_state}
                  label="Valitse koko aukiolojakson tila"
                  options={resourceStateConfig.options}
                />
                {isResourceStateSet(resourceStateValue) && (
                  <SupplementaryButton
                    className="opening-period-clear-state-button"
                    dataTest="clear-resource-state-button"
                    onClick={(): void => {
                      clearResourceState();
                    }}
                    iconLeft={<IconTrash />}>
                    Tyhjennä valinta
                  </SupplementaryButton>
                )}
              </div>
            </div>
          </section>
        </div>
        {isResourceStateSet(resourceStateValue) ? (
          <section
            key="resource-state-notification"
            data-test="resource-state-notification"
            className="form-section resource-state-notification-row">
            <Notification
              label="Aukiolojaksolle on valittu aukiolotila"
              style={{ zIndex: 0 }}>
              Kun aukiolojaksolle on valittu aukiolotila niin se poistaa tämän
              jakson kaikki muut mahdolliset aukiolot.
            </Notification>
          </section>
        ) : (
          <>
            {timeSpanGroupFields.map((timeSpanGroup, index: number) => (
              <section
                key={`time-span-group-${timeSpanGroup.timeSpanGroupUiId}`}
                data-test={`time-span-group-${timeSpanGroup.id || 'new'}`}
                className="form-section time-span-group">
                <div className="form-actions-row">
                  <h3 className="opening-period-section-title">Aukioloryhmä</h3>
                  <SupplementaryButton
                    dataTest="remove-time-span-group"
                    onClick={(): void => {
                      removeTimeSpanGroup(index);
                    }}
                    iconLeft={<IconTrash />}>
                    Poista aukioloryhmä
                  </SupplementaryButton>
                </div>
                <input
                  type="hidden"
                  defaultValue={timeSpanGroup.id}
                  {...register(`${timeSpanGroupFieldName}.${index}.id`)}
                />
                <input
                  type="hidden"
                  defaultValue={timeSpanGroup.period}
                  {...register(`${timeSpanGroupFieldName}.${index}.period`)}
                />
                <TimeSpans
                  groupIndex={index}
                  groupId={timeSpanGroup.id}
                  namePrefix={timeSpanGroupFieldName}
                  resourceStateConfig={resourceStateConfig}
                />
                <Rules
                  groupIndex={index}
                  groupId={timeSpanGroup.id}
                  namePrefix={timeSpanGroupFieldName}
                  ruleConfig={ruleConfig}
                />
              </section>
            ))}
            <div className="form-actions-row form-actions-row-condensed time-span-group-action-row">
              <SupplementaryButton
                dataTest="add-time-span-group"
                onClick={(): void => appendTimeSpanGroup(defaultTimeSpanGroup)}
                iconLeft={<IconPlus />}>
                Luo uusi aukioloryhmä tähän jaksoon
              </SupplementaryButton>
              <NotificationText
                id="opening-period-group-info"
                className="opening-period-notification-text"
                message="Lisää uusi ryhmä tähän aukiolojaksoon jos haluat lisätä
              aukioloaikoja useammilla eri säännöillä"
              />
            </div>
          </>
        )}
        <div className="opening-period-final-action-row-container">
          <MainContainer>
            <PrimaryButton
              dataTest="publish-opening-period-button"
              className="opening-period-final-action-button"
              type="submit">
              Julkaise
            </PrimaryButton>
            <SecondaryButton
              className="opening-period-final-action-button"
              onClick={(): void => returnToResourcePage()}>
              Peruuta ja palaa
            </SecondaryButton>
          </MainContainer>
        </div>
      </form>
    </FormProvider>
  );
}
