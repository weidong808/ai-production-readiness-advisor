import corpusJson from "../../../content/corpus/corpus.json";
import type { CorpusChunk, CorpusFile } from "@/lib/corpus/types";

const corpus = corpusJson as CorpusFile;

export const CORPUS_VERSION = corpus.version;

export function getCorpus(): CorpusFile {
  return corpus;
}

export function getChunkById(id: string): CorpusChunk | undefined {
  return corpus.chunks.find((c) => c.id === id);
}

export function resolveCitations(ids: string[]) {
  const unique = [...new Set(ids)];
  const citations = [];
  const unknown: string[] = [];
  for (const id of unique) {
    const chunk = getChunkById(id);
    if (!chunk) {
      unknown.push(id);
      continue;
    }
    citations.push({
      id: chunk.id,
      title: chunk.title,
      source: chunk.source,
      chunkId: chunk.id,
      url: chunk.url,
    });
  }
  return { citations, unknown };
}
