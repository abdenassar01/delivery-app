export type JobSearchResponse = {
  stellenangebote?: {
    hashId?: string;
    beruf?: string;
    refnr?: string;
    arbeitgeber?: string;
    aktuelleVeroeffentlichungsdatum?: string;
    eintrittsdatum?: string;
    arbeitsort?: {
      plz?: number;
      ort?: string;
      strasse?: string;
      region?: string;
      land?: string;
      koordinaten?: {
        lat?: number;
        lon?: number;
      };
    };
    modifikationsTimestamp?: string;
  }[];
  maxErgebnisse?: string;
  page?: string;
  size?: string;
  facetten?: {
    befristung?: {
      counts?: object;
      maxCount?: number;
    };
    behinderung?: {
      counts?: object;
      maxCount?: number;
    };
    pav?: {
      counts?: object;
      maxCount?: number;
    };
    berufsfeld?: {
      counts?: object;
      maxCount?: number;
    };
    arbeitsort?: {
      counts?: object;
      maxCount?: number;
    };
    ausbildungsart?: {
      counts?: object;
      maxCount?: number;
    };
    veroeffentlichtseit?: {
      counts?: object;
      maxCount?: number;
    };
    schulbildung?: {
      counts?: object;
      maxCount?: number;
    };
    arbeitsort_plz?: {
      counts?: object;
      maxCount?: number;
    };
    arbeitgeber?: {
      counts?: object;
      maxCount?: number;
    };
    beruf?: {
      counts?: object;
      maxCount?: number;
    };
    branche?: {
      counts?: object;
      maxCount?: number;
    };
    arbeitszeit?: {
      counts?: object;
      maxCount?: number;
    };
    eintrittsdatum?: {
      counts?: object;
      maxCount?: number;
    };
    zeitarbeit?: {
      counts?: object;
      maxCount?: number;
    };
    corona?: {
      counts?: object;
      maxCount?: number;
    };
  }[];
};

export type JobDetails = {
  aktuelleVeroeffentlichungsdatum?: string;
  angebotsart?: string;
  arbeitgeber?: string;
  branchengruppe?: string;
  branche?: string;
  arbeitgeberHashId?: string;
  arbeitsorte?: {
    land?: string;
    region?: string;
    plz?: string;
    ort?: string;
    strasse?: string;
    koordinaten?: {
      lat?: number;
      lon?: number;
    };
  }[];
  arbeitszeitmodelle?: string[];
  befristung?: string;
  uebernahme?: boolean;
  betriebsgroesse?: string;
  eintrittsdatum?: string;
  ersteVeroeffentlichungsdatum?: string;
  allianzpartner?: string;
  allianzpartnerUrl?: string;
  titel?: string;
  hashId?: string;
  beruf?: string;
  modifikationsTimestamp?: string;
  stellenbeschreibung?: string;
  refnr?: string;
  fuerFluechtlingeGeeignet?: boolean;
  nurFuerSchwerbehinderte?: boolean;
  anzahlOffeneStellen?: number;
  arbeitgeberAdresse?: {
    land?: string;
    region?: string;
    plz?: string;
    ort?: string;
    strasse?: string;
    strasseHausnummer?: string;
  };
  fertigkeiten?: {
    hierarchieName?: string;
    auspraegungen?: object;
  }[];
  mobilitaet?: {
    reisebereitschaft?: string;
  };
  fuehrungskompetenzen?: {
    hatVollmacht?: boolean;
    hatBudgetverantwortung?: boolean;
  };
  verguetung?: string;
  arbeitgeberdarstellungUrl?: string;
  arbeitgeberdarstellung?: string;
  hauptDkz?: string;
  istBetreut?: boolean;
  istGoogleJobsRelevant?: boolean;
  anzeigeAnonym?: boolean;
};
