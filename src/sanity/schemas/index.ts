import { extraBlockType, extraSocialType, stillType } from "./objects";
import { kitItemType } from "./kitItem";
import { projectType } from "./project";
import { siteSettingsType } from "./siteSettings";

export const schemaTypes = [
  stillType,
  extraBlockType,
  extraSocialType,
  siteSettingsType,
  projectType,
  kitItemType,
];

export {
  extraBlockType,
  extraSocialType,
  kitItemType,
  projectType,
  siteSettingsType,
  stillType,
};
