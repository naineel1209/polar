'use client'

import { DashboardBody } from '@/components/Layout/DashboardLayout'
import { Add, Bolt } from '@mui/icons-material'
import { Organization } from '@polar-sh/sdk'
import Link from 'next/link'
import { Button } from 'polarkit/components/ui/atoms'
import {
  useOrganizationHasActiveAccount,
  useSubscriptionTiers,
} from 'polarkit/hooks'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import EmptyLayout from '../Layout/EmptyLayout'
import AccountBanner from '../Transactions/AccountBanner'
import SubscriptionTierCard from './SubscriptionTierCard'

interface TiersPageProps {
  organization: Organization
}

const TiersPage: React.FC<TiersPageProps> = ({ organization }) => {
  const { data: subscriptionTiers } = useSubscriptionTiers(organization.name)
  const hasActiveAccount = useOrganizationHasActiveAccount(organization.id)

  if (!subscriptionTiers?.items?.length) {
    return (
      <EmptyLayout>
        <div className="dark:text-polar-600 flex flex-col items-center justify-center space-y-10 py-96 text-gray-400">
          <span className="text-6xl text-blue-400">
            <Bolt fontSize="inherit" />
          </span>
          <h2 className="text-lg">
            You haven&apos;t configured any subscription tiers
          </h2>
          <Link
            href={`/maintainer/${organization.name}/subscriptions/tiers/new`}
          >
            <Button variant="secondary">Create Subscription Tier</Button>
          </Link>
        </div>
      </EmptyLayout>
    )
  }

  return (
    <DashboardBody>
      <div className="flex flex-col gap-y-12 py-2">
        {!hasActiveAccount && (
          <AccountBanner org={organization} accounts={[]} />
        )}
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-y-2">
            <h2 className="text-lg font-medium">Subscription Tiers</h2>
            <p className="dark:text-polar-500 text-sm text-gray-500">
              Manage your subscription tiers & benefits
            </p>
          </div>
          <div>
            <Link
              href={{
                pathname: `/maintainer/${organization.name}/subscriptions/tiers/new`,
              }}
              className={twMerge(
                ...(!hasActiveAccount ? ['pointer-events-none'] : []),
              )}
            >
              <Button disabled={!hasActiveAccount}>
                <Add className="mr-2" fontSize="small" />
                New Tier
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {subscriptionTiers.items.map((tier) => (
            <SubscriptionTierCard
              className="h-full"
              key={tier.id}
              subscriptionTier={tier}
            >
              <Link
                key={tier.id}
                href={`/maintainer/${organization.name}/subscriptions/tiers/${tier.id}`}
                className="w-full"
              >
                <Button variant="outline" fullWidth>
                  Edit Tier
                </Button>
              </Link>
            </SubscriptionTierCard>
          ))}
        </div>
      </div>
    </DashboardBody>
  )
}

export default TiersPage
