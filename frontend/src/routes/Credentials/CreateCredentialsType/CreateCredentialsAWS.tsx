/* Copyright Contributors to the Open Cluster Management project */
import { ExternalLinkAltIcon } from '@patternfly/react-icons'
import { CatalogCardItemType, ICatalogCard, ItemView, DataViewStringContext } from '@stolostron/react-data-view'
import { useCallback, useMemo } from 'react'
import { useIsHypershiftEnabled } from '../../../hooks/use-hypershift-enabled'
import { useTranslation } from '../../../lib/acm-i18next'
import { useDataViewStrings } from '../../../lib/dataViewStrings'
import { DOC_LINKS } from '../../../lib/doc-util'
import { NavigationPath, useBackCancelNavigation } from '../../../NavigationPath'
import { AcmIcon, AcmIconVariant, AcmPage, AcmPageHeader, Provider } from '../../../ui-components'
import { getTypedCreateCredentialsPath } from '../CreateCredentialsCatalog'

export function CreateCredentialsAWS() {
  const [t] = useTranslation()
  const { nextStep, back, cancel } = useBackCancelNavigation()
  const isHypershiftEnabled = useIsHypershiftEnabled()

  const cards = useMemo(() => {
    const newCards: ICatalogCard[] = [
      {
        id: 'aws-standard',
        title: t('Amazon Web Services'),
        icon: <AcmIcon icon={AcmIconVariant.aws} />,
        items: [
          {
            type: CatalogCardItemType.Description,
            description: t('Red Hat OpenShift Provisioning'),
          },
        ],
        onClick: nextStep(getTypedCreateCredentialsPath(Provider.aws)),
      },
      {
        id: 'aws-bucket',
        title: t('S3 Bucket'),
        icon: <AcmIcon icon={AcmIconVariant.awss3} />,
        items: [
          {
            type: CatalogCardItemType.Description,
            description: t('OIDC Secret for Red Hat OpenShift Provisioning with hosted control plane'),
          },
        ],
        onClick: isHypershiftEnabled ? nextStep(getTypedCreateCredentialsPath(Provider.awss3)) : undefined,
        alertTitle: isHypershiftEnabled
          ? undefined
          : t('Hosted control plane operator and hypershift add-on must be enabled in order to continue'),
        alertVariant: 'info',
        alertContent: (
          <a href={DOC_LINKS.HOSTED_ENABLE_FEATURE_AWS} target="_blank" rel="noopener noreferrer">
            {t('View documentation')} <ExternalLinkAltIcon />
          </a>
        ),
      },
    ]
    return newCards
  }, [nextStep, t, isHypershiftEnabled])

  const keyFn = useCallback((card: ICatalogCard) => card.id, [])

  const breadcrumbs = useMemo(() => {
    const newBreadcrumbs = [
      { text: t('Credentials'), to: NavigationPath.credentials },
      { text: t('Credential type'), to: NavigationPath.addCredentials },
      { text: t('Amazon Web Services credential') },
    ]
    return newBreadcrumbs
  }, [t])

  const dataViewStrings = useDataViewStrings()

  return (
    <AcmPage
      header={
        <AcmPageHeader
          title={t('Amazon Web Services credential')}
          description={t('Choose your AWS credential.')}
          breadcrumb={breadcrumbs}
        />
      }
    >
      <DataViewStringContext.Provider value={dataViewStrings}>
        <ItemView
          items={cards}
          itemKeyFn={keyFn}
          itemToCardFn={(card) => card}
          onBack={back(NavigationPath.createCluster)}
          onCancel={cancel(NavigationPath.clusters)}
        />
      </DataViewStringContext.Provider>
    </AcmPage>
  )
}