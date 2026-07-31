import { useState } from "react";
import { Save, User, Coins, PiggyBank, Info } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { useAppDispatch, useAppSelector } from "../../store";
import { setCurrency, setMonthBudget } from "../../store/slices/settingsSlice";
import { CURRENCIES } from "../../constants/data";
import { APP_NAME, APP_VERSION } from "../../constants/app";
import { formatCurrency, currentMonth, formatMonth } from "../../lib/format";
import { useFinanceSelectors } from "../../store/hooks";
import toast from "react-hot-toast";

const Settings = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((s) => s.settings);
  const { totalIncome, totalExpense } = useFinanceSelectors();

  const [currencyCode, setCurrencyCode] = useState(settings.currency.code);
  const [monthBudget, setLocalMonthBudget] = useState(String(settings.monthBudget));
  const [profileName, setProfileName] = useState("My Profile");

  const saveCurrency = () => {
    const cur = CURRENCIES.find((c) => c.code === currencyCode);
    if (cur) {
      dispatch(setCurrency(cur));
      toast.success(`Currency set to ${cur.label}`);
    }
  };

  const saveBudget = () => {
    const val = Number(monthBudget);
    if (val >= 0) {
      dispatch(setMonthBudget(val));
      toast.success("Monthly budget updated");
    } else {
      toast.error("Budget must be a positive number");
    }
  };

  const saveProfile = () => {
    toast.success("Profile saved");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-500">Manage your preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
            <User size={22} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Profile</h3>
            <p className="text-sm text-slate-500">Personal information</p>
          </div>
        </div>
        <div className="space-y-4">
          <Input
            label="Display Name"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
          />
          <Button onClick={saveProfile}>
            <Save size={16} /> Save Profile
          </Button>
        </div>
      </Card>

      {/* Currency */}
      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
            <Coins size={22} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Currency</h3>
            <p className="text-sm text-slate-500">Select your display currency</p>
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1">
            <Select
              label="Currency"
              value={currencyCode}
              onChange={(e) => setCurrencyCode(e.target.value)}
              options={CURRENCIES.map((c) => ({
                value: c.code,
                label: `${c.symbol} ${c.code} — ${c.label}`,
              }))}
            />
          </div>
          <Button onClick={saveCurrency}>
            <Save size={16} /> Apply
          </Button>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Currently showing amounts in {settings.currency.symbol} {settings.currency.code}.
        </p>
      </Card>

      {/* Default monthly budget */}
      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
            <PiggyBank size={22} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Default Monthly Budget</h3>
            <p className="text-sm text-slate-500">
              Used as fallback when no category budgets are set for {formatMonth(currentMonth())}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1">
            <Input
              label="Amount"
              type="number"
              value={monthBudget}
              onChange={(e) => setLocalMonthBudget(e.target.value)}
            />
          </div>
          <Button onClick={saveBudget}>
            <Save size={16} /> Save
          </Button>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Preview: {formatCurrency(Number(monthBudget) || 0, settings.currency)}
        </p>
      </Card>

      {/* Financial summary */}
      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
            <Info size={22} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Financial Summary</h3>
            <p className="text-sm text-slate-500">All-time totals</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-slate-400">Total Income</p>
            <p className="text-lg font-bold text-emerald-600">
              {formatCurrency(totalIncome, settings.currency)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Expense</p>
            <p className="text-lg font-bold text-rose-600">
              {formatCurrency(totalExpense, settings.currency)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Net</p>
            <p
              className={`text-lg font-bold ${
                totalIncome - totalExpense >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {formatCurrency(totalIncome - totalExpense, settings.currency)}
            </p>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-800">{APP_NAME}</p>
            <p className="text-sm text-slate-500">Version {APP_VERSION}</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            Active
          </span>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
