interface State {
  id: number;
  name: string;
}

export interface CountryDto {
  id: string;
  name: string;
  phoneCode: string;
  states: State[];
}
