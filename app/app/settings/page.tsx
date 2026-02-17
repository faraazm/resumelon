"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  CheckIcon,
  CreditCardIcon,
  SparklesIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

export default function SettingsPage() {
  const { user } = useUser();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Mock subscription data - will be replaced with Stripe
  const subscription = {
    plan: "free", // "free" | "pro" | "lifetime"
    status: "active",
    currentPeriodEnd: null,
  };

  const isPro = subscription.plan === "pro" || subscription.plan === "lifetime";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <div className="space-y-8">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="h-16 w-16 rounded-full"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xl font-medium text-muted-foreground">
                    {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium">
                  {user?.fullName || "User"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user?.emailAddresses?.[0]?.emailAddress}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  defaultValue={user?.firstName || ""}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  defaultValue={user?.lastName || ""}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button>Save changes</Button>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Subscription Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription and billing
                </CardDescription>
              </div>
              <Badge variant={isPro ? "default" : "secondary"}>
                {subscription.plan === "lifetime"
                  ? "Lifetime"
                  : subscription.plan === "pro"
                  ? "Pro"
                  : "Free"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isPro ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <CheckIcon className="h-5 w-5 text-green-500" />
                  <span>Unlimited resumes and cover letters</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckIcon className="h-5 w-5 text-green-500" />
                  <span>AI-powered content suggestions</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckIcon className="h-5 w-5 text-green-500" />
                  <span>Premium templates</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckIcon className="h-5 w-5 text-green-500" />
                  <span>Priority support</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Billing</p>
                    <p className="text-sm text-muted-foreground">
                      {subscription.plan === "lifetime"
                        ? "One-time payment"
                        : `Next billing date: ${subscription.currentPeriodEnd || "N/A"}`}
                    </p>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <CreditCardIcon className="h-4 w-4" />
                    Manage billing
                    <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-dashed p-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <SparklesIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Upgrade to Pro</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Get unlimited resumes, AI suggestions, premium templates, and more.
                      </p>
                      <Button className="mt-3">
                        Upgrade now
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-2">Free plan includes:</p>
                  <ul className="space-y-1">
                    <li>• 1 resume</li>
                    <li>• Basic templates</li>
                    <li>• PDF downloads</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Choose what updates you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about your resumes and account
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing-emails">Marketing emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive tips, product updates, and special offers
                </p>
              </div>
              <Switch
                id="marketing-emails"
                checked={marketingEmails}
                onCheckedChange={setMarketingEmails}
              />
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="destructive">Delete account</Button>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
