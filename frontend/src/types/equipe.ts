export type TeamMemberSocial = {
  linkedin?: string;
  github?: string;
};

export type TeamMemberData = {
  id: string;
  name: string;
  rm: string;
  role: string;
  bio: string;
  social: TeamMemberSocial;
};

export type TeamMember = TeamMemberData & {
  photo: string;
};

export type TeamManifest = {
  memberIds: string[];
};
