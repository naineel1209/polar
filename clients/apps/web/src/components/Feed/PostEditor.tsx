import { useBenefits } from '@/hooks/queries'
import { MaintainerOrganizationContext } from '@/providers/maintainerOrganization'
import { Article } from '@polar-sh/sdk'
import Link from 'next/link'
import Button from 'polarkit/components/ui/atoms/button'
import Input from 'polarkit/components/ui/atoms/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'polarkit/components/ui/atoms/select'
import { ShadowBoxOnMd } from 'polarkit/components/ui/atoms/shadowbox'
import { TabsContent } from 'polarkit/components/ui/atoms/tabs'
import React, { PropsWithChildren, useContext, useState } from 'react'
import { DashboardBody } from '../Layout/DashboardLayout'
import { MarkdownEditor } from '../Markdown/MarkdownEditor'
import { SyntaxHighlighterProvider } from '../SyntaxHighlighterShiki/SyntaxHighlighterClient'
import LongformPost from './LongformPost'
import { BrowserClientRender } from './Markdown/Render/BrowserClientRender'
import { PublishSettings } from './Publishing/PublishSettings'
import { PostToolbar } from './Toolbar/PostToolbar'
import {
  useMarkdownComponents,
  youtubeIdFromURL,
} from './Toolbar/useMarkdownComponents'
import { EditorHelpers, useEditorHelpers } from './useEditorHelpers'

const defaultPostEditorContext: EditorHelpers = {
  bodyRef: { current: null },
  titleRef: { current: null },
  insertTextAtCursor: (_text: string) => {},
  wrapSelectionWithText: ([_before, _after]: [string, string]) => {},
  handleChange: (_: React.ChangeEvent<HTMLTextAreaElement>) => {},
  handleDrag: (_: React.DragEvent<HTMLTextAreaElement>) => {},
  handleDragOver: (_: React.DragEvent<HTMLTextAreaElement>) => {},
  handleDrop: (_: React.DragEvent<HTMLTextAreaElement>) => {},
  handleKeyDown: (_: React.KeyboardEvent<HTMLTextAreaElement>) => {},
  handlePaste: (_: React.ClipboardEvent<HTMLTextAreaElement>) => {},
}

export const PostEditorContext = React.createContext(defaultPostEditorContext)

type PostEditorContextProviderProps = PropsWithChildren<{
  onChange: (value: string) => void
}>

const PostEditorContextProvider = ({
  onChange,
  children,
}: PostEditorContextProviderProps) => {
  const helpers = useEditorHelpers(onChange)

  return (
    <PostEditorContext.Provider value={helpers}>
      {children}
    </PostEditorContext.Provider>
  )
}

interface PostEditorProps {
  article?: Article
  title: string
  body: string
  onTitleChange: (title: string) => void
  onBodyChange: (body: string) => void
  previewProps: React.ComponentProps<typeof LongformPost>
  disabled?: boolean
  canCreate?: boolean
}

export const PostEditor = ({
  article,
  title,
  body,
  onTitleChange,
  onBodyChange,
  previewProps,
  disabled,
  canCreate,
}: PostEditorProps) => {
  const [previewAs, setPreviewAs] = useState<string>('premium')

  return (
    <PostEditorContextProvider onChange={onBodyChange}>
      <SyntaxHighlighterProvider>
        <PostToolbar
          article={article}
          previewAs={previewAs}
          onPreviewAsChange={setPreviewAs}
          canCreate={canCreate}
        />
        <div>
          <DashboardBody className="mt-0 !p-8">
            <div className="flex flex-row">
              <div className="flex w-full flex-col px-4 pb-6 sm:px-6 md:px-8">
                <TabsContent className="flex-grow" value="edit" tabIndex={-1}>
                  <Editor
                    title={title}
                    body={body}
                    onTitleChange={onTitleChange}
                    disabled={disabled}
                    article={article}
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <div className="dark:md:bg-polar-900 dark:md:border-polar-800 dark:ring-polar-800 relative my-8 flex min-h-screen w-full flex-col items-center rounded-[3rem] ring-1 ring-gray-100 md:bg-gray-50 md:p-12 md:shadow-sm dark:ring-1 dark:md:border">
                    <LongformPost
                      {...previewProps}
                      isSubscriber={previewAs === 'premium'}
                      hasPaidArticlesBenefit={previewAs === 'premium'}
                      showShare={false}
                      isAuthor={true}
                    >
                      <BrowserClientRender
                        {...previewProps}
                        showPaywalledContent={previewAs === 'premium'}
                        isSubscriber={previewAs === 'premium'}
                      />
                    </LongformPost>
                  </div>
                </TabsContent>
                <TabsContent
                  value="settings"
                  className="flex flex-col gap-16 md:mt-8 md:flex-row md:items-start md:justify-between"
                >
                  {article && <PublishSettings article={article} />}
                </TabsContent>
              </div>
            </div>
          </DashboardBody>
        </div>
      </SyntaxHighlighterProvider>
    </PostEditorContextProvider>
  )
}

type EditorProps = Pick<
  PostEditorProps,
  'title' | 'body' | 'onTitleChange' | 'disabled' | 'article'
>

const Editor = ({
  title,
  body,
  onTitleChange,
  disabled,
  article,
}: EditorProps) => {
  const { titleRef, bodyRef } = useContext(PostEditorContext)

  const onTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move focus to body
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      if (bodyRef.current) {
        e.preventDefault()
        bodyRef.current.focus()
      }
    }
  }

  return (
    <div className="relative z-[1] flex flex-row md:gap-x-4 lg:gap-x-8">
      <div className="flex flex-1 flex-col gap-y-8 py-8">
        <input
          className="transparent dark:placeholder:text-polar-500 min-w-full border-none bg-transparent px-0 text-3xl font-medium shadow-none outline-none focus:ring-0"
          autoFocus
          placeholder="Title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          disabled={disabled}
          ref={titleRef}
          onKeyDown={onTitleKeyDown}
        />
        <MarkdownEditor
          className="focus:ring-none rounded-none border-none bg-transparent p-0 shadow-none outline-none focus:ring-transparent focus-visible:ring-transparent dark:bg-transparent dark:shadow-none dark:outline-none dark:focus:ring-transparent"
          value={body}
          disabled={disabled}
          isPaidArticle={Boolean(article?.paid_subscribers_only)}
        />
      </div>
      <Sidebar />
    </div>
  )
}

const Sidebar = () => {
  const { insertPaywall, insertSubscribeNow, insertAd } =
    useMarkdownComponents()

  const { organization: org } = useContext(MaintainerOrganizationContext)

  const benefits = useBenefits(org.id)
  const benefitItems = benefits.data?.items ?? []
  const adBenefits = benefitItems.filter((b) => b.type === 'ads')

  const [selectedAdBenefit, setSelectedAdBenefit] = useState<string>()

  return (
    <div>
      <div className="sticky top-24 hidden w-full min-w-[250px] max-w-[280px] flex-col gap-y-4 lg:flex">
        <ShadowBoxOnMd className="dark:border-polar-700 w-full md:p-8 dark:border">
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col gap-y-4">
                <h3 className="dark:text-white">Components</h3>
                <div className="flex flex-col gap-y-2">
                  <Button
                    variant={'outline'}
                    size={'sm'}
                    fullWidth={true}
                    onClick={insertPaywall}
                  >
                    <span className="whitespace-nowrap text-center">
                      Paywall
                    </span>
                  </Button>

                  <Button
                    variant={'outline'}
                    size={'sm'}
                    fullWidth={true}
                    onClick={insertSubscribeNow}
                  >
                    <span className="flex-1 whitespace-nowrap text-center">
                      Subscribe Now
                    </span>
                  </Button>
                </div>
              </div>
            </div>

            {benefits.isFetched ? (
              <>
                <div className="flex flex-col gap-y-2">
                  <h3 className="text-sm">Ad</h3>

                  {adBenefits.length > 0 ? (
                    <>
                      <Select onValueChange={setSelectedAdBenefit}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select benefit" />
                        </SelectTrigger>
                        <SelectContent>
                          {adBenefits.map((b) => (
                            <SelectItem value={b.id} key={b.id}>
                              {b.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant={'outline'}
                        size={'sm'}
                        disabled={!selectedAdBenefit}
                        onClick={() => {
                          insertAd(
                            selectedAdBenefit ?? 'INSERT_BENEFIT_ID_HERE',
                          )
                        }}
                      >
                        Add
                      </Button>
                    </>
                  ) : (
                    <p className="dark:text-polar-400 text-sm text-gray-600">
                      Setup your first ad{' '}
                      <Link
                        href={`/dashboard/${org.slug}/benefits`}
                        className="text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        benefit
                      </Link>{' '}
                      to enable ads.
                    </p>
                  )}
                </div>
              </>
            ) : null}

            <SidebarYouTube />
          </div>
        </ShadowBoxOnMd>
      </div>
    </div>
  )
}

const SidebarYouTube = () => {
  const [url, setURL] = useState('')
  const { insertYouTube } = useMarkdownComponents()

  const validURL = Boolean(youtubeIdFromURL(url))

  return (
    <div className="flex flex-col gap-y-2">
      <h3 className="text-sm">YouTube</h3>

      <Input
        placeholder="Video URL"
        value={url}
        onChange={(e) => setURL(e.target.value)}
      />
      <Button
        className="self-start"
        size={'sm'}
        onClick={() => {
          insertYouTube(url)
        }}
        disabled={!validURL}
      >
        Add
      </Button>
    </div>
  )
}
