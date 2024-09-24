'use client'

import { Checkout } from '@/components/Checkout/Checkout'
import { StorefrontNav } from '@/components/Organization/StorefrontNav'
import { StorefrontHeader } from '@/components/Profile/StorefrontHeader'
import { MaintainerOrganizationContext } from '@/providers/maintainerOrganization'
import ShadowBox from 'polarkit/components/ui/atoms/shadowbox'
import { useContext } from 'react'
import { PRODUCT_PREVIEW } from '../utils'

export const CheckoutPreview = () => {
  const { organization: org } = useContext(MaintainerOrganizationContext)

  return (
    <ShadowBox className="dark:bg-polar-950 flex h-full w-full flex-col items-center overflow-y-auto">
      <div className="flex w-full max-w-7xl flex-col items-center gap-y-12">
        {org.profile_settings?.enabled && (
          <>
            <StorefrontHeader organization={org} />
            <StorefrontNav organization={org} />
          </>
        )}
        <Checkout organization={org} product={PRODUCT_PREVIEW} disabled />
      </div>
    </ShadowBox>
  )
}
