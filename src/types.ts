export enum SupernotesStatus {
  JUNKED = -2,
  INTERNAL,
  INBOX,
  UNKEPT,
  KEPT
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum SupernotesRoles {
  AUTHOR = 2097151,
  MODERATOR = 524287,
  EDITOR = 211951,
  CONTRIBUTOR = 207823,
  READER = 207695
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum SupernotesPerm {
  VIEW_COMMENTS = 2 ** 1,
  ADD_COMMENT = 2 ** 2,
  MANAGE_COMMENTS = 2 ** 3,
  EDIT_DATA = 2 ** 4,
  ADD_CHILDREN = 2 ** 5,
  PUBLISH_CHILDREN = 2 ** 6,
  MANAGE_PARENTS = 2 ** 7,
  CREATE_SHARE_CODES = 2 ** 8,
  MANAGE_SHARE_CODES = 2 ** 9,
  VIEW_MEMBERS = 2 ** 10,
  MANAGE_MEMBERS = 2 ** 11,
  DELETE_FOR_EVERYONE = 2 ** 12,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum SupernotesViewDisplayType {
  LIST = 1,
  BROADSHEET = 2,
  GRAPH = 4
}

export type SupernotesCard = {
  backlinks: string[],
  data: {
    color: string
    comment_count: number
    created_when: string
    html: string
    icon: string
    id: string
    likes: number
    markup: string
    member_count: number
    meta: any
    modified_by_id: string
    modified_when: string
    name: string
    owner_id: string
    public_child_count: number
    synced_when: string
    tags: string[]
    targeted_when: string
    ydoc: string
  }
  membership: {
    auto_publish_children: boolean
    created_when: string
    enrolled_when: string
    id: string
    liked: boolean
    modified_when: string
    opened_when: string
    perms: number
    personal_color: string
    personal_tags: string[]
    status: number
    total_child_count: number
    via_id: string
    via_type: number
    view: {
      display_type: number
      sort_ascending: boolean
      sort_type: number
    }
    visibility: number
  }
  parents: any
}
