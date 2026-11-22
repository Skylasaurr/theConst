import TimeClock from "./TimeClock";
import EmployeesAccount from "./EmployeesAccount";

export default function IWSEmployees() {
  return (
    <div className="grid gap-4">
      <TimeClock />
      <EmployeesAccount />
    </div>
  );
}
