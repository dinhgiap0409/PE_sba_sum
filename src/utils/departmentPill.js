// Department pill colour, matching the exam mock-ups:
// IT blue, HR green, Finance amber, Marketing purple, Sales teal.
export function departmentPillClass(departmentName) {
  const key = String(departmentName || "")
    .trim()
    .toLowerCase();
  switch (key) {
    case "it":
      return "ems-dept-pill ems-dept-it";
    case "hr":
      return "ems-dept-pill ems-dept-hr";
    case "finance":
      return "ems-dept-pill ems-dept-finance";
    case "marketing":
      return "ems-dept-pill ems-dept-marketing";
    case "sales":
      return "ems-dept-pill ems-dept-sales";
    default:
      return "ems-dept-pill ems-dept-default";
  }
}
