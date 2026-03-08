# Agent Media Architecture (TalkAI)

## Overview
TalkAI supports agent identity media via voice samples and face assets. The system is designed as a provider-abstracted pipeline with:
- secure, authenticated uploads
- async processing via Inngest
- clear processing states and fallbacks
- non-breaking integration with existing Stream/OpenAI realtime flows

## Data Model
- `agents` includes `voiceProfile` and `faceProfile` fields (provider ids, URLs, status, errors, quality scores).
- `media_uploads` tracks each uploaded asset (kind, mime, size, status, storage key, URL).

Processing states follow `media_processing_status`:
- `pending` ? `processing` ? `ready`
- `failed` for hard failures

## Upload Flow
1. Client gathers file metadata (size, duration/dimensions) and user consent.
2. Client requests an upload session (`media.createUploadSession`).
3. Client uploads the file via `PUT /api/media/upload/:uploadId` with a short-lived token.
4. Server stores the file, updates agent fields, and emits `agents/media.process`.
5. UI polls via normal agent queries to show processing state.

Uploads are scoped to authenticated users and stored outside `public/` under `data/uploads`.
Assets are served through `GET /api/media/file/:uploadId`, which requires the user’s session.

## Processing Pipeline
Inngest function `agents/media-processing` performs lightweight checks and assigns quality scores:
- voice: duration-based score, marks `voiceProcessingStatus` ready
- face: marks `faceProcessingStatus` ready and assigns a baseline quality score

Provider-specific steps (normalization, lip-sync, avatar synthesis) are intentionally abstracted and can be added inside this function.

## Call Presence
- `realtime-agent-engine` resolves voice selection and applies it to the OpenAI realtime session.
- `avatar-engine` resolves the agent’s face asset (or generated avatar) for display.
- Call UI overlays a static agent tile that lights up when the agent is speaking.

## Limitations & Fallbacks
- Video thumbnails are not generated server-side (requires ffmpeg or a provider). The UI uses static tiles.
- Lip-sync and realtime avatar modes currently fall back to static tiles until an avatar engine is configured.
- Voice sample uploads are stored and scored, but do not yet train a custom TTS provider.

## Config & Extensibility
- Storage root can be changed with `MEDIA_UPLOAD_DIR`.
- Provider adapters live under `src/modules/agents/engines/`.
- Future providers should implement:
  - `voice-engine` to map provider voice config
  - `avatar-engine` to resolve face assets
  - processing steps in `agents/media-processing`
