/* eslint-disable prettier/prettier */
export interface IEmployees {
 id: number;
 employee_pin: string;
 Employee_Username: string;
 Clock_Status: boolean;
}

export interface IInitial {
 fieldValues: {
  username: string;
  pin: string;
  ipaddress: string;
  localTime: string;
  timezoneClient: string;
  timezoneOffset: string;
 };
 error: string;
 reset: boolean;
}

export interface IResetPassword {
 fieldValues: {
  username: string;
  ipaddress: string;
  old: string;
  new: string;
  confirm: string;
 };
 error: string;
 reset: boolean;
}

export interface UserLogDto {
 id: number;
 password: string;
 ipaddress: string;
 localTime: string;
 timezoneOffset: string;
 timezoneClient: string;
}
