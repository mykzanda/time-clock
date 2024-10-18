/* eslint-disable prettier/prettier */
import {
  createDirectus,
  staticToken,
  rest,
  readItems,
  verifyHash,
  createItem,
  updateItem,
} from "@directus/sdk";

//should be in env
const apiClient = process.env.DIRECTUS_API_KEY
  ? createDirectus("https://data.zanda.info")
      .with(staticToken("YQRwVAFUn-LlC_IOPoOkpVLeH75QBlyI"))
      .with(rest({ credentials: "include" }))
  : undefined;

//Ip address list
const iplist: any = "time_clock_allowed_ips";

export async function checkIpAddress(ip: string) {
  return await apiClient?.request(
    readItems(iplist, {
      fields: ["IP_Address"],
      filter: {
        IP_Address: {
          _eq: ip,
        },
      },
    })
  );
}

//Employees
const employees: any = "Employees";

export async function getEmployees() {
  try {
    const data = await apiClient?.request(
      readItems(employees, {
        fields: ["id", "Employee_Username", "employee_pin", "Clock_Status"],
      })
    );

    return data;
  } catch (error) {
    return error;
  }
}
export async function getUser(user: string) {
  try {
    const data = await apiClient?.request(
      readItems(employees, {
        fields: ["id", "Employee_Username", "employee_pin", "Clock_Status"],
        filter: {
          Employee_Username: {
            _eq: user,
          },
        },
        limit: 1,
      })
    );

    return data;
  } catch (error) {
    return error;
  }
}

//Logs
const log: any = "Attendance_Clocks";

export async function AttendanceIn(
  user: number,
  timein: string,
  timezone: string,
  offset: string
) {
  try {
    const data = await apiClient?.request(
      createItem(log, {
        clock_user: user,
        clock_in_utc: timein,
        local_device_timezone: timezone,
        timezone_offset: offset,
      })
    );

    return data;
  } catch (error) {
    return error;
  }
}

export async function ExtendTimeIn(user: number) {
  try {
    const data = await apiClient?.request(
      updateItem(employees, user, {
        Clock_Status: true,
      })
    );

    return data;
  } catch (error) {
    return error;
  }
}

export async function AttendanceOut(id: number, timeout: string) {
  try {
    const data = await apiClient?.request(
      updateItem(log, id, {
        clock_out_utc: timeout,
      })
    );

    return data;
  } catch (error) {
    return error;
  }
}

export async function ExtendTimeOut(user: number) {
  try {
    const data = await apiClient?.request(
      updateItem(employees, user, {
        Clock_Status: false,
      })
    );

    return data;
  } catch (error) {
    return error;
  }
}

// Clocks
const attendance: any = "Attendance_Clocks";

export async function getRecentClock(user: number) {
  try {
    const data = await apiClient?.request(
      readItems(attendance, {
        fields: ["*"],
        filter: {
          clock_user: {
            _eq: user,
          },
        },
        sort: ["-date_created"],
        limit: 1,
      })
    );

    return data;
  } catch (error) {
    return error;
  }
}

//Hashing

export async function verifyPin(pin: string, hash: string) {
  return apiClient?.request(verifyHash(pin, hash));
}

//Pin Update

export async function UpdatePin(id: number, pin: string) {
  return await apiClient?.request(
    updateItem(employees, id, {
      employee_pin: pin,
    })
  );
}
