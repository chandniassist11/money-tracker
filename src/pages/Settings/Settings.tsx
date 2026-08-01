import { useState } from "react";
import { Save, User, Coins, PiggyBank, Info, Sparkles } from "lucide-react";
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

      <div className="stagger space-y-6">
        {/* Profile */}
        <Card className="p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/25">
              <User size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Profile</h3>
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
        <Card className="p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-500/25">
              <Coins size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Currency</h3>
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
          <p className="mt-3 text-xs font-medium text-slate-400">
            Currently showing amounts in {settings.currency.symbol} {settings.currency.code}.
          </p>
        </Card>

        {/* Default monthly budget */}
        <Card className="p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/25">
              <PiggyBank size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Default Monthly Budget</h3>
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
          <p className="mt-3 text-xs font-medium text-slate-400">
            Preview: {formatCurrency(Number(monthBudget) || 0, settings.currency)}
          </p>
        </Card>

        {/* Financial summary */}
        <Card className="p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 text-white shadow-lg shadow-slate-500/25">
              <Info size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Financial Summary</h3>
              <p className="text-sm text-slate-500">All-time totals</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-emerald-50/50 p-3.5">
              <p className="text-xs font-medium text-slate-400">Total Income</p>
              <p className="mt-1 text-lg font-extrabold text-emerald-600">
                {formatCurrency(totalIncome, settings.currency)}
              </p>
            </div>
            <div className="rounded-xl bg-rose-50/50 p-3.5">
              <p className="text-xs font-medium text-slate-400">Total Expense</p>
              <p className="mt-1 text-lg font-extrabold text-rose-600">
                {formatCurrency(totalExpense, settings.currency)}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3.5">
              <p className="text-xs font-medium text-slate-400">Net</p>
              <p
                className={`mt-1 text-lg font-extrabold ${
                  totalIncome - totalExpense >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {formatCurrency(totalIncome - totalExpense, settings.currency)}
              </p>
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-md shadow-emerald-500/25">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="font-bold text-slate-800">{APP_NAME}</p>
                <p className="text-sm text-slate-500">Version {APP_VERSION}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
