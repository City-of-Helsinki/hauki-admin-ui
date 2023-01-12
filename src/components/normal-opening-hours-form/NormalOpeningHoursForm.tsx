import React from 'react';
import { ResourceState } from '../../common/lib/types';
import { formatDate } from '../../common/utils/date-time/format';
import { defaultTimeSpan, defaultTimeSpanGroup } from '../../constants';
import OpeningHoursForm, {
  FormConfig,
  OpeningHoursFormProps,
} from '../opening-hours-form/OpeningHoursForm';

const config: FormConfig = {
  exception: false,
  defaultValues: {
    fixed: false,
    endDate: null,
    startDate: formatDate(new Date().toISOString()),
    name: {
      fi: null,
      sv: null,
      en: null,
    },
    openingHours: [
      {
        weekdays: [1, 2, 3, 4, 5],
        timeSpanGroups: [defaultTimeSpanGroup],
      },
      {
        weekdays: [6, 7],
        timeSpanGroups: [
          {
            ...defaultTimeSpanGroup,
            timeSpans: [
              {
                ...defaultTimeSpan,
                resource_state: ResourceState.CLOSED,
              },
            ],
          },
        ],
      },
    ],
    override: false,
  },
  texts: {
    submit: {
      notifications: {
        success: 'Aukiolon tallennus onnistui',
        error: 'Aukiolon tallennus epäonnistui',
      },
    },
    title: {
      placeholders: {
        fi: 'Esim. kesäkausi',
        sv: 'T.ex. sommartid',
        en: 'E.g. summertime',
      },
    },
  },
};

const NormalOpeningHoursForm = (
  props: Omit<OpeningHoursFormProps, 'config'>
): JSX.Element => {
  return <OpeningHoursForm config={config} {...props} />;
};

export default NormalOpeningHoursForm;
