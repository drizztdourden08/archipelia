/* @layer core @kind config */

const IN_TOTO_PAYLOAD_TYPE = 'application/vnd.in-toto+json';

const IN_TOTO_STATEMENT_TYPE = 'https://in-toto.io/Statement/v1';

const ATTESTED_PREDICATE = 'https://slsa.dev/provenance/v1';

const SOURCE_REPOSITORY_OID = [1, 3, 6, 1, 4, 1, 57264, 1, 12];

const GITHUB_HOST = 'https://github.com';

const SIGNER_PATTERN = /^https:\/\/github\.com\/([^/]+\/[^/]+)\/(\.github\/workflows\/[^@]+)@(refs\/.+)$/;

export { GITHUB_HOST, IN_TOTO_PAYLOAD_TYPE, IN_TOTO_STATEMENT_TYPE, SIGNER_PATTERN, ATTESTED_PREDICATE, SOURCE_REPOSITORY_OID };
