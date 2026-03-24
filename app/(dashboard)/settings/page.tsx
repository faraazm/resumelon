"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useUser, useClerk } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { SupportDialog } from "@/components/app/support-dialog";
import { UpgradeDialog } from "@/components/app/upgrade-dialog";

interface SubscriptionData {
  subscribed: boolean;
  subscription: {
    id: string;
    status: string;
    priceId: string;
    currentPeriodEnd: number;
    cancelAtPeriodEnd: boolean;
  } | null;
}

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const deleteAccountMutation = useMutation(api.users.deleteAccount);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Real subscription data from Stripe
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoadingSub, setIsLoadingSub] = useState(true);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);

  const fetchSubscription = useCallback(async () => {
    try {
      const res = await fetch("/api/stripe/subscription");
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    } finally {
      setIsLoadingSub(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const isPro = subscription?.subscribed === true;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const handleManageBilling = async () => {
    setIsOpeningPortal(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to open billing portal:", error);
      setIsOpeningPortal(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "delete my account") return;

    setIsDeleting(true);
    try {
      await deleteAccountMutation({});
      await signOut({ redirectUrl: "/" });
    } catch (error) {
      console.error("Error deleting account:", error);
      setIsDeleting(false);
    }
  };

  // Format subscription details
  const planLabel = (() => {
    if (isLoadingSub) return "Loading...";
    if (!isPro) return "Free Plan";
    const sub = subscription?.subscription;
    if (!sub) return "Pro Plan";
    const monthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY;
    const isYearly = sub.priceId !== monthlyPriceId;
    return isYearly ? "Pro Plan (Yearly)" : "Pro Plan (Monthly)";
  })();

  const renewalInfo = (() => {
    if (!isPro || !subscription?.subscription) return null;
    const sub = subscription.subscription;
    const date = new Date(sub.currentPeriodEnd * 1000).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    if (sub.cancelAtPeriodEnd) {
      return `Your plan will be canceled on ${date}`;
    }
    return `Renews on ${date}`;
  })();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and preferences
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="flex items-center gap-4">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="h-14 w-14 rounded-full"
                />
              ) : (
                <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-lg font-medium text-muted-foreground">
                    {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold">
                  {user?.fullName || "User"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user?.emailAddresses?.[0]?.emailAddress}
                </p>
                {memberSince && (
                  <p className="text-sm text-muted-foreground">
                    Member since {memberSince}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscription Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>{planLabel}</CardTitle>
                <CardDescription>
                  {renewalInfo || "Manage your subscription and billing"}
                </CardDescription>
              </div>
              {isPro ? (
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleManageBilling}
                  disabled={isOpeningPortal}
                >
                  <CreditCardIcon className="h-4 w-4" />
                  {isOpeningPortal ? "Opening..." : "Manage Billing"}
                </Button>
              ) : (
                <Button
                  onClick={() => setShowUpgrade(true)}
                  disabled={isLoadingSub}
                >
                  Upgrade
                </Button>
              )}
            </CardHeader>
          </Card>
        </motion.div>

        {/* Contact Support Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Have a question, issue, or feature request? We&apos;re here to help.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setSupportDialogOpen(true)}
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                Get Help
              </Button>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Delete Account Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Delete account</CardTitle>
                <CardDescription>
                  Permanently delete your account and all data
                </CardDescription>
              </div>
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete account
              </Button>
            </CardHeader>
          </Card>
        </motion.div>
      </div>

      {/* Upgrade Dialog */}
      <UpgradeDialog open={showUpgrade} onOpenChange={setShowUpgrade} />

      {/* Support Dialog */}
      <SupportDialog open={supportDialogOpen} onOpenChange={setSupportDialogOpen} />

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              This will permanently delete your account, all resumes, cover
              letters, and associated data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="deleteConfirm" className="text-sm">
              Type <span className="font-semibold">delete my account</span> to
              confirm
            </Label>
            <Input
              id="deleteConfirm"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="delete my account"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteConfirmText("");
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== "delete my account" || isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
