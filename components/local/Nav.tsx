export interface iCrumb<T extends CrumbType> {
  label: string;
  crumbType: T;
  link?: string;
  dropdown?: iCrumb<CrumbType>[];
}
export type CrumbType = "Label" | "Link" | "Dropdown";

/**
 * Builds <nav /> tag that produces a path navigation.
 * @param crumbs - Object to build path variables
 */
export function makeCrumbs(...crumbs: iCrumb<any>[]) {
  return (
    <nav class="crumbs">
      <ol>
        {crumbs.map((crumb) => {
          if (!crumb) {
            throw new Error("raw dough! - should probably never trigger.");
          }

          // returning li as link
          if (crumb.link) {
            return (
              <li class="crumb">
                <a href={crumb.link}>{crumb.label}</a>
              </li>
            );
          }

          // returning li as dropdown menu
          if (crumb.dropdown) {
            // crumb index is being used as option value.
            return (
              <li class="crumb">
                <select>
                  <option value="">...</option>
                  {crumb.dropdown.map((op, i) => {
                    return <option value={i}>{op.label}</option>;
                  })}
                </select>
              </li>
            );
          }

          // Returning li as plain text label
          return <li class="crumb">{crumb.label}</li>;
        })}
      </ol>
    </nav>
  );
}
