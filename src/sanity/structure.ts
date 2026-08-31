import { BookIcon, ClipboardIcon, EnvelopeIcon, FolderIcon, UserIcon } from '@sanity/icons'

export const structure = (S: any) => {
  return S.list()
    .title('Sanity Studio')
    .items([
      // Blog at top level
      S.listItem()
        .title('Blog')
        .icon(BookIcon)
        .child(S.documentTypeList('post').title('Blog Posts')),

      // Forms at top level
      S.listItem()
        .title('Forms')
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Forms')
            .items([
              S.listItem()
                .title('Intake Form')
                .icon(ClipboardIcon)
                .child(S.documentTypeList('intakeForm').title('Intake Form Submissions')),
              S.listItem()
                .title('Contact Form')
                .icon(EnvelopeIcon)
                .child(S.documentTypeList('contactForm').title('Contact Form Submissions')),
            ]),
        ),

      // People at top level
      S.listItem()
        .title('People')
        .icon(UserIcon)
        .child(
          S.list()
            .title('People')
            .items([
              S.listItem()
                .title('Users')
                .icon(UserIcon)
                .child(S.documentTypeList('user').title('Users')),
            ]),
        ),
    ])
}
