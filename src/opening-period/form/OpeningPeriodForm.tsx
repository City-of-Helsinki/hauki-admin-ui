import React, { useState } from 'react';
import { ArrayField, useFieldArray, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import {
  DatePeriod,
  DatePeriodFormOptions,
  Language,
  GroupRule,
  TimeSpanFormFormat,
  TimeSpanGroup,
} from '../../common/lib/types';
import { transformDateToApiFormat } from '../../common/utils/date-time/format';
import Datepicker from '../../components/datepicker/Datepicker';
import { PrimaryButton, SecondaryButton } from '../../components/button/Button';
import { ErrorToast, SuccessToast } from '../../components/notification/Toast';
import {
  formatApiTimeSpansToFormFormat,
  formatTimeSpansToApiFormat,
} from './form-helpers/form-helpers';
import OpeningPeriodDescription from './description/OpeningPeriodDescription';
import TimeSpan from './time-span/TimeSpan';
import Rule from './rule/Rule';
import './OpeningPeriodForm.scss';

interface OpeningPeriodFormData {
  openingPeriodTitle: string;
  openingPeriodOptionalDescription: string;
  openingPeriodBeginDate: string | undefined;
  openingPeriodEndDate: string | undefined;
  timeSpans: Array<TimeSpanFormFormat> | {}[];
  rules: GroupRule[] | {}[];
}

type SubmitStatus = 'init' | 'succeeded' | 'error';

type NotificationTexts = {
  label: string;
  text: string;
};

export default function OpeningPeriodForm({
  formId,
  datePeriod,
  resourceId,
  datePeriodOptions,
  submitFn,
  successTextAndLabel,
  errorTextAndLabel,
}: {
  formId: string;
  datePeriod?: DatePeriod;
  resourceId: number;
  datePeriodOptions: DatePeriodFormOptions;
  submitFn: (datePeriod: DatePeriod) => Promise<DatePeriod>;
  successTextAndLabel: NotificationTexts;
  errorTextAndLabel: NotificationTexts;
}): JSX.Element {
  const language = Language.FI;
  const { resourceStateOptions } = datePeriodOptions;
  const { ruleContextOptions } = datePeriodOptions.timeSpanGroup;
  const { ruleSubjectOptions } = datePeriodOptions.timeSpanGroup;
  const { ruleFrequencyModifierOptions } = datePeriodOptions.timeSpanGroup;

  const firstTimeSpanGroup: TimeSpanGroup | undefined =
    datePeriod?.time_span_groups[0];

  const spans: TimeSpanFormFormat[] | {}[] =
    firstTimeSpanGroup && firstTimeSpanGroup.time_spans
      ? formatApiTimeSpansToFormFormat(firstTimeSpanGroup.time_spans)
      : [{}];

  const rules: GroupRule[] | {}[] = firstTimeSpanGroup?.rules.length
    ? firstTimeSpanGroup?.rules
    : [{}];

  const [periodBeginDate, setPeriodBeginDate] = useState<Date | null>(
    datePeriod?.start_date ? new Date(datePeriod?.start_date) : null
  );
  const [periodEndDate, setPeriodEndDate] = useState<Date | null>(
    datePeriod?.end_date ? new Date(datePeriod?.end_date) : null
  );

  const formValues: OpeningPeriodFormData = {
    openingPeriodTitle: datePeriod?.name[language] || '',
    openingPeriodOptionalDescription: datePeriod?.description[language] || '',
    openingPeriodBeginDate: datePeriod?.start_date,
    openingPeriodEndDate: datePeriod?.end_date,
    timeSpans: spans,
    rules,
  };

  const { register, handleSubmit, errors, control, setValue } = useForm<
    OpeningPeriodFormData
  >({
    mode: 'all',
    defaultValues: formValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    keyName: 'timeSpanUiId',
    name: 'timeSpans',
  });

  const { fields: ruleFields } = useFieldArray({
    control,
    keyName: 'rulesUiId',
    name: 'rules',
  });

  const history = useHistory();

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('init');

  const onSubmit = async (data: OpeningPeriodFormData): Promise<void> => {
    const validTimeSpans: TimeSpanFormFormat[] = data.timeSpans.filter(
      (span: TimeSpanFormFormat | {}) => Object.keys(span).length > 0
    ) as TimeSpanFormFormat[];

    const validRules: GroupRule[] = data.rules.filter(
      (rule: GroupRule | {}): boolean => {
        const validValues = Object.values(rule)
          .filter((value) => value !== '')
          .filter((val) => val);
        return validValues.length > 0;
      }
    ) as GroupRule[];

    try {
      const dataAsDatePeriod: DatePeriod = {
        ...(datePeriod?.id ? { id: datePeriod.id } : {}),
        resource: resourceId,
        name: {
          fi: data.openingPeriodTitle,
          sv: null,
          en: null,
        },
        description: {
          fi: data.openingPeriodOptionalDescription,
          sv: null,
          en: null,
        },
        start_date: data.openingPeriodBeginDate
          ? transformDateToApiFormat(data.openingPeriodBeginDate)
          : undefined,
        end_date: data.openingPeriodEndDate
          ? transformDateToApiFormat(data.openingPeriodEndDate)
          : undefined,
        override: datePeriod?.override || false,
        time_span_groups: [
          {
            id: firstTimeSpanGroup?.id,
            period: firstTimeSpanGroup?.period,
            time_spans: formatTimeSpansToApiFormat(validTimeSpans || []),
            rules: validRules,
          },
        ],
      };
      await submitFn(dataAsDatePeriod);
      setSubmitStatus('succeeded');
    } catch (err) {
      setSubmitStatus('error');
      // eslint-disable-next-line no-console
      console.error(err); // For debug purposes
    }
  };

  return (
    <>
      {submitStatus === 'succeeded' && (
        <SuccessToast
          dataTestId="opening-period-form-success"
          label={successTextAndLabel.label}
          text={successTextAndLabel.text}
          onClose={(): void => setSubmitStatus('init')}
        />
      )}
      {submitStatus === 'error' && (
        <ErrorToast
          dataTestId="opening-period-form-error"
          label={errorTextAndLabel.label}
          text={errorTextAndLabel.text}
          onClose={(): void => setSubmitStatus('init')}
        />
      )}
      <form
        id={formId}
        data-test={formId}
        className="opening-period-form"
        onSubmit={handleSubmit(onSubmit)}>
        <section className="form-section">
          <OpeningPeriodDescription register={register} errors={errors} />
        </section>
        <section className="form-section">
          <h3 className="opening-period-section-title">Ajanjakso</h3>
          <div className="form-control">
            <section className="opening-period-time-period">
              <Datepicker
                id="openingPeriodBeginDate"
                dataTest="openingPeriodBeginDate"
                labelText="Alkaa"
                onChange={(value): void => setPeriodBeginDate(value || null)}
                value={periodBeginDate}
                registerFn={register}
              />
              <p className="dash-between-begin-and-end-date">—</p>
              <Datepicker
                id="openingPeriodEndDate"
                dataTest="openingPeriodEndDate"
                labelText="Päättyy"
                onChange={(value): void => setPeriodEndDate(value || null)}
                value={periodEndDate}
                registerFn={register}
              />
            </section>
          </div>
        </section>
        <section className="form-section time-span-group">
          <h3 className="opening-period-section-title">Aukioloajat</h3>
          <ul
            className="opening-period-time-span-list form-group"
            data-test="time-span-list">
            {fields.map(
              (
                item: Partial<ArrayField<Record<string, TimeSpanFormFormat>>>,
                index
              ) => (
                <li
                  className="opening-period-time-span-list-item"
                  key={`time-span-${item.id || index}`}>
                  <TimeSpan
                    item={item}
                    resourceStateOptions={resourceStateOptions}
                    control={control}
                    register={register}
                    index={index}
                    remove={remove}
                  />
                </li>
              )
            )}
          </ul>
          <div className="form-group">
            <SecondaryButton
              dataTest="add-new-time-span-button"
              onClick={(): void => append({})}
              className="add-new-time-span-button">
              + Lisää aukioloaika
            </SecondaryButton>
          </div>
          <div className="form-group">
            <h3 className="opening-period-section-title">
              Aukioloaikojen voimassaolo
            </h3>
            <ul className="opening-period-rule-list form-group">
              {ruleFields.map(
                (
                  rule: Partial<ArrayField<Record<string, GroupRule>>>,
                  index
                ) => (
                  <li
                    className="opening-period-rule-list-item"
                    key={`rule-${index}`}>
                    <Rule
                      rule={rule}
                      index={index}
                      control={control}
                      setValue={setValue}
                      register={register}
                      ruleContextOptions={ruleContextOptions}
                      ruleFrequencyModifierOptions={
                        ruleFrequencyModifierOptions
                      }
                      ruleSubjectOptions={ruleSubjectOptions}
                    />
                  </li>
                )
              )}
            </ul>
          </div>
        </section>
        <div className="opening-period-final-action-row-container">
          <PrimaryButton
            dataTest="publish-opening-period-button"
            className="opening-period-final-action-button"
            type="submit">
            Julkaise
          </PrimaryButton>
          <SecondaryButton
            className="opening-period-final-action-button"
            onClick={(): void => history.push(`/resource/${resourceId}`)}>
            Peruuta ja palaa
          </SecondaryButton>
        </div>
      </form>
    </>
  );
}
