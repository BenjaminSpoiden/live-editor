import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, $isRootOrShadowRoot } from "lexical";
import { $findMatchingParent } from "@lexical/utils";
import { $isHeadingNode } from "@lexical/rich-text"
import { useCallback, useSyncExternalStore } from "react";

export const useActiveBlock = () => {
  const [editor] = useLexicalComposerContext();

  const onSubscribe = useCallback(
    (onStoreChangeListener: () => void) => {
      return editor.registerUpdateListener(onStoreChangeListener);
    },
    [editor]
  );

  const onGetSnapshot = useCallback(() => {
    return editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return null;

      const anchor = selection.anchor.getNode();

      let element =
        anchor.getKey() === "root"
          ? anchor
          : $findMatchingParent(anchor, (node) => {
              const parent = node.getParent();
              return parent !== null && $isRootOrShadowRoot(node);
            });

      if (element === null) {
        element = anchor.getTopLevelElementOrThrow();
      }

      if ($isHeadingNode(element)) {
        return element.getTag();
      }

      return element.getType();
    });
  }, [editor]);

  return useSyncExternalStore(onSubscribe, onGetSnapshot, onGetSnapshot);
}
