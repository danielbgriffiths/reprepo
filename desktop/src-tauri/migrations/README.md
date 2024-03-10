## Database Model

### Run Diesel

- `diesel --database-url $(cat .env.{ENV}) migration run`

### Tables

- **users**
  - User profile
  - *(plural because 'user' is reserved)*
- **artist_profile** (`user_id`)
  - Repository for a user's repertoire scoped to an artistic specialization
- **record** (`artist_profile_id`)
  - Repertoire entry in a user's artist profile
- **media** (`user_id`)
  - Documentation, images or recordings uploaded or attached by the user in an artist profile
- **checkpoint** (`record_id`)
  - Documentations of progress on a record in a user's artist profile
- **record_media** (`record_id`, `media_id`)
  - Connect a media entry with a record generally
- **checkpoint_media** (`checkpoint_id`, `media_id`)
  - Connect a media entry with a checkpoint of a record
- **musician_repertoire** (`user_id`)
  - A standardized option for a artist profile record
  - Track the user who adds the option to provide credit/clout
  - Spelling and standardization is validated using LLM/other resources
- **musician_repertoire_record** (`musician_repertoire_id`, `record_id`)
  - Connect a record with a repertoire options