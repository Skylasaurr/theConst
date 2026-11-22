import TimeClock from "./TimeClock";
import EmployeesAccount from "./EmployeesAccount";

export default function IWSEmployees({ data, notify, currentUserId }) {
  return (
    <div className="grid gap-4">
      <TimeClock data={data} notify={notify} />
      <EmployeesAccount
        data={data}
        notify={notify}
        currentUserId={currentUserId}
      />
    </div>
  );
}
