# Data Intelligence Layer

All agents use one canonical evidence model.

Each fact contains: source, publisher, URL/reference, retrieved_at, published_at, asset/entity, claim, data type, confidence, verification_state, freshness, and conflict set.

Pipeline:
INGEST → NORMALIZE → DEDUPE → VERIFY → SCORE → STORE → DISTRIBUTE.

The same evidence snapshot is provided to all debating agents to prevent hidden-data arguments.
