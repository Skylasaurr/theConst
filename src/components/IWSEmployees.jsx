import TimeClock from "./TimeClock";
import EmployeesAccount from "./EmployeesAccount";

function IWSEmployees() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
      <TimeClock />
      <EmployeesAccount />
    </div>
  );
}
