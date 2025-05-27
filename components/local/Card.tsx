export interface iArticle<T extends CardType> {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  cardType: T;
}
export type CardType = "Post" | "Document";

/**
 * Builds card around an <article /> tag .
 * @example
 * ```
 * make({content: '', id: "", title: "", type: "Post"})
 * ```
 * @param art - Object to build a card
 */
export function makeArticle(art: iArticle<CardType>) {
  return (
    <article
      id={art.id}
      class="card"
      // Adding tags as data attribute
      data-card-type={art.cardType}
      {...(art.tags && {
        "data-tags": art.tags.reduce((line, tag) => {
          if (!line || line.length == 0) {
            return tag;
          }
          return line + "," + tag;
        }),
      })}
    >
      <header>
        <h2>{art.title}</h2>
      </header>
      <div class="content">
        <p>{art.content}</p>
      </div>
    </article>
  );
}

