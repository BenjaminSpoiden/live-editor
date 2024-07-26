import { Editor } from "@tiptap/react";
import React from "react";
import styles from './WordCount.module.css'

export const WordCount: React.FC<{ editor: Editor }> = ({ editor }) => (
  <div className={styles.wordCount}>
    {editor.storage.characterCount.words()} words,{" "}
    {editor.storage.characterCount.characters()} characters
  </div>
);