import { Mark, mergeAttributes } from "@tiptap/core";
import { highlightEvent } from "../../utils/commentUtils";

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
      commentHighlight: {
        // Create a comment highlight mark
        setCommentHighlight: (attributes: {
          color?: string;
          highlightId: string | null;
          state: "composing" | "complete";
        }) => ReturnType;

        // Toggle a comment highlight mark
        toggleCommentHighlight: (attributes: {
          color?: string;
          highlightId: string | null;
          state: "composing" | "complete";
        }) => ReturnType;

        // Remove a comment highlight mark
        unsetCommentHighlight: () => ReturnType;
      };
    }
}


export const LiveblocksCommentsHighlight = Mark.create<
  CommentHighlightOptions,
  CommentHighlightStorage
>({
  name: "commentHighlight",
  addOptions: () => {
    return {
      HTMLAttributes: {},
    };
  },
  addStorage: () => {
    return {
      showComposer: true,
      activeHighlightId: null,
      currentHighlightId: null,
    };
  },
  addCommands() {
    return {
      setCommentHighlight:
        (attributes) =>
        ({ commands }) => {
          this.storage.currentHighlightId = attributes.highlightId;
          this.storage.showComposer = true;
          return commands.setMark(this?.name, attributes);
        },
      toggleCommentHighlight:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, attributes);
        },
      unsetCommentHighlight:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
  addAttributes() {
    return {
        highlightId: {
            default: null,
            parseHTML: (element) => element.getAttribute("data-highlight-id"),
            renderHTML: (attributes) => {
            if (!attributes.highlightId) {
                return;
            }

            return {
                "data-highlight-id": attributes.highlightId,
            };
            },
        },
        state: {
            default: "complete",
            parseHTML: (element) => element.getAttribute("data-state"),
            renderHTML: (attributes) => {
            if (!attributes.state) {
                return {};
            }

            return {
                "data-state": attributes.state,
            };
            },
        },
        color: {
            default: null,
            parseHTML: (element) =>
            element.getAttribute("data-color") || element.style.backgroundColor,
            renderHTML: (attributes) => {
            if (!attributes.color) {
                return {};
            }

            return {
                style: `--commentHighlightColor: ${attributes.color}; background-color: var(--commentHighlightColor); color: inherit`,
            };
            },
        },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'mark',
        priority: 51
      }
    ]
  },
  renderHTML({ HTMLAttributes }) {
      const highlightId = HTMLAttributes?.["data-highlight-id"] || null;
      const elem = document.createElement("mark");

       Object.entries(
         mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
           "data-selected": "false",
         })
       ).forEach(([attr, val]) => elem.setAttribute(attr, val));

       const handlePointerEnter = (event: MouseEvent) => {
         const targetIsCurrentMark =
           event.target instanceof HTMLElement
             ? event.target === elem || elem.contains(event.target)
             : false;
         elem.dataset.selected = targetIsCurrentMark ? "true" : "false";

         if (!this.editor) {
           return;
         }

         if (targetIsCurrentMark) {
           highlightEvent(highlightId);
           this.editor.storage.commentHighlight.activeHighlightId = highlightId;
           return;
         }
       };

       const handlePointerLeave = () => {
         elem.dataset.selected = "false";

         if (!this.editor) {
           return;
         }

         highlightEvent(null);
         this.editor.storage.commentHighlight.activeHighlightId = null;
       };

       // Avoid memory leak with `.on...`
       elem.onpointerenter = handlePointerEnter;
       elem.onpointerleave = handlePointerLeave;

       return elem;
  },
});
