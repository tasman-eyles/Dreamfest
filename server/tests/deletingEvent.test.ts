import { setupApp } from './setup.tsx'
import { beforeAll, describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import nock from 'nock'