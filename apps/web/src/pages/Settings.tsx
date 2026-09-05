import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { Save, Shield, Zap, Bell, CreditCard, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

type SettingsForm = {
  businessName: string;
  supportEmail: string;
  maxRetries: number;
  retryDelayHours: number;
  couponPercent: number;
  autoRetry: boolean;
  requireApproval: boolean;
  notifyEmail: boolean;
  notifyWhatsapp: boolean;
  razorpayKeyId: string;
};

const defaults: SettingsForm = {
  businessName: 'Merchant Inc.',
  supportEmail: 'billing@merchant.inc',
  maxRetries: 3,
  retryDelayHours: 2,
  couponPercent: 10,
  autoRetry: true,
  requireApproval: true,
  notifyEmail: true,
  notifyWhatsapp: true,
  razorpayKeyId: 'rzp_test_••••••••',
};

export const Settings: React.FC = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm<SettingsForm>({ defaultValues: defaults });

  const autoRetry = watch('autoRetry');
  const requireApproval = watch('requireApproval');
  const notifyEmail = watch('notifyEmail');
  const notifyWhatsapp = watch('notifyWhatsapp');

  const onSubmit = async (data: SettingsForm) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    toast('Settings saved successfully', 'success');
    console.debug('Saved settings', data);
  };

  const Toggle = ({
    checked,
    onChange,
    label,
    description,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
    description: string;
  }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-start justify-between gap-4 p-4 rounded-xl border border-border hover:border-primary/25 hover:bg-slate-50/80 transition-all text-left"
    >
      <div>
        <div className="text-sm font-semibold text-ink">{label}</div>
        <div className="text-xs text-ink-muted mt-0.5 leading-relaxed">{description}</div>
      </div>
      <span
        className={`relative mt-0.5 w-10 h-6 rounded-full transition-colors shrink-0 ${
          checked ? 'bg-primary' : 'bg-slate-200'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-soft transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </span>
    </button>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted mb-1.5">Configuration</p>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink tracking-tight">Settings</h1>
        <p className="text-ink-muted text-sm mt-1">Recovery policies, integrations, and notification preferences.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-xl bg-accent-soft text-accent">
                <Building2 size={18} />
              </div>
              <div>
                <h2 className="font-display font-semibold text-ink">Business profile</h2>
                <p className="text-xs text-ink-muted">Shown on merchant receipts and outreach.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-ink-secondary">Business name</span>
                <input className="input-field mt-1.5" {...register('businessName', { required: true })} />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-ink-secondary">Support email</span>
                <input type="email" className="input-field mt-1.5" {...register('supportEmail', { required: true })} />
              </label>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-xl bg-primary-soft text-primary">
                <Zap size={18} />
              </div>
              <div className="flex-1">
                <h2 className="font-display font-semibold text-ink">Recovery policy</h2>
                <p className="text-xs text-ink-muted">Controls how the AI agent retries and offers coupons.</p>
              </div>
              <Badge variant="info">Live rules</Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 mb-4">
              <label className="block">
                <span className="text-xs font-semibold text-ink-secondary">Max retries</span>
                <input type="number" min={0} max={10} className="input-field mt-1.5" {...register('maxRetries', { valueAsNumber: true })} />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-ink-secondary">Retry delay (hrs)</span>
                <input type="number" min={1} max={72} className="input-field mt-1.5" {...register('retryDelayHours', { valueAsNumber: true })} />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-ink-secondary">Max coupon %</span>
                <input type="number" min={0} max={50} className="input-field mt-1.5" {...register('couponPercent', { valueAsNumber: true })} />
              </label>
            </div>
            <div className="space-y-2">
              <Toggle
                checked={autoRetry}
                onChange={(v) => setValue('autoRetry', v)}
                label="Auto-retry bank timeouts"
                description="Retry soft declines automatically within the delay window."
              />
              <Toggle
                checked={requireApproval}
                onChange={(v) => setValue('requireApproval', v)}
                label="Require merchant approval"
                description="Coupons and high-value outreach need explicit approval."
              />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-xl bg-sky-50 text-sky-700">
                <Bell size={18} />
              </div>
              <div>
                <h2 className="font-display font-semibold text-ink">Notifications</h2>
                <p className="text-xs text-ink-muted">How your team hears about recoveries and approvals.</p>
              </div>
            </div>
            <div className="space-y-2">
              <Toggle
                checked={notifyEmail}
                onChange={(v) => setValue('notifyEmail', v)}
                label="Email alerts"
                description="Send recovery and approval digests to the support inbox."
              />
              <Toggle
                checked={notifyWhatsapp}
                onChange={(v) => setValue('notifyWhatsapp', v)}
                label="WhatsApp customer outreach"
                description="Allow AI-approved WhatsApp reminders for failed payments."
              />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <CreditCard size={18} />
              </div>
              <div className="flex-1">
                <h2 className="font-display font-semibold text-ink">Razorpay</h2>
                <p className="text-xs text-ink-muted">Payment retries use your Razorpay merchant keys.</p>
              </div>
              <Badge variant="success" className="gap-1.5">
                <Shield size={11} /> Connected
              </Badge>
            </div>
            <label className="block">
              <span className="text-xs font-semibold text-ink-secondary">Key ID</span>
              <input className="input-field mt-1.5 font-mono text-xs" {...register('razorpayKeyId')} />
            </label>
          </Card>
        </motion.div>

        <div className="flex justify-end gap-2 sticky bottom-4">
          <Button type="submit" isLoading={saving} className="shadow-panel">
            <Save size={16} /> Save changes
          </Button>
        </div>
      </form>
    </div>
  );
};
