import React from 'react';
import { ResourceState } from '../../common/lib/types';
import { formatDate } from '../../common/utils/date-time/format';
import OpeningHoursForm, {
  FormConfig,
  OpeningHoursFormProps,
} from '../opening-hours-form/OpeningHoursForm';

const config: FormConfig = {
  exception: true,
  defaultValues: {
    startDate: formatDate(new Date().toISOString()),
    endDate: formatDate(new Date().toISOString()),
    fixed: true,
    name: { fi: '', sv: '', en: '' },
    override: true,
    resourceState: ResourceState.CLOSED,
    openingHours: [],
  },
  texts: {
    submit: {
      notifications: {
        success: `Poikkeavan päivän aukiolon lisääminen onnistui`,
        error: `Poikkeavan päivän aukiolon lisääminen epäonnistui`,
      },
    },
    title: {
      placeholders: {
        fi: 'Esim. koulutuspäivä',
        sv: 'T.ex. utbildningsdag',
        en: 'E.g. training day',
      },
    },
  },
};

const ExceptionOpeningHoursForm = (
  props: Omit<OpeningHoursFormProps, 'config'>
): JSX.Element => {
  return <OpeningHoursForm config={config} {...props} />;
};

export default ExceptionOpeningHoursForm;
