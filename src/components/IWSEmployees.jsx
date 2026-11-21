import TimeClock from "./TimeClock";
import EmployeesAccount from "./EmployeesAccount";

export default function IWSEmployees() {
  return (
    <div className="grid gap-4 lg:grid-row-[1fr_300px]">
      <TimeClock />
      <EmployeesAccount />
    </div>
  );
}
