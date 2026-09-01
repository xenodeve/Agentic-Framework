# Triage Labels

<!-- lang:en -->

Five canonical triage roles (matt-pocock vocabulary, used unchanged) plus the T4 delta groups.

## Triage state (every issue carries exactly one)

| Label | Meaning |
|---|---|
| `needs-triage` | new, not yet assessed |
| `needs-info` | blocked waiting on more information from reporter or developer |
| `ready-for-agent` | scoped enough for an agent to pick up |
| `ready-for-human` | needs a human decision |
| `wontfix` | considered, not doing — reason in the issue |

## Type (one or more)

`Bug` · `tech-debt` · `security` · `Optimization` · `Cleanup` · `Feature` · `Test`

## Severity (exactly one, for Bug / security)

`critical` · `Major` · `Minor`

**A `security` issue must be `critical` or `Major` — never `Minor`.**

## Component (exactly one)

`site` (React/Next.js code under `src/`) · `content` (Markdown under `content/`) · `infra` (CI, hooks, guards, tooling)

## Lifecycle (optional)

`Latent` (known, not yet active) · `Dormant` (inactive, may re-activate). A `Latent` bug that activates is upgraded to a full `Bug` issue with a severity.

## Labels to create

```sh
"C:\Program Files\GitHub CLI\gh.exe" label create \
  needs-triage needs-info ready-for-agent ready-for-human wontfix \
  Bug tech-debt security Optimization Cleanup Feature Test \
  critical Major Minor site content infra Latent Dormant
```

Report which were created, which already existed, and which the vocabulary names but you skipped. A documented vocabulary with no labels behind it reads as configured and is not.

<!-- lang:th -->

ห้าบทบาท triage มาตรฐาน (ศัพท์ของ matt-pocock ใช้โดยไม่เปลี่ยน) + กลุ่ม delta ของ T4

## Triage state (ทุก issue มีちょうどหนึ่ง)

| Label | ความหมาย |
|---|---|
| `needs-triage` | ใหม่ ยังไม่ได้ประเมิน |
| `needs-info` | ติดรอข้อมูลเพิ่มจากคนรายงานหรือ dev |
| `ready-for-agent` | scope ชัดพอที่ agent จะรับทำ |
| `ready-for-human` | ต้องให้คนตัดสินใจ |
| `wontfix` | พิจารณาแล้ว ไม่ทำ — เหตุผลอยู่ใน issue |

## Type (หนึ่งขึ้นไป)

`Bug` · `tech-debt` · `security` · `Optimization` · `Cleanup` · `Feature` · `Test`

## Severity (ちょうどหนึ่ง สำหรับ Bug / security)

`critical` · `Major` · `Minor`

**issue `security` ต้องเป็น `critical` หรือ `Major` — ห้าม `Minor`**

## Component (ちょうどหนึ่ง)

`site` (โค้ด React/Next.js ใน `src/`) · `content` (Markdown ใน `content/`) · `infra` (CI, hooks, guards, tooling)

## Lifecycle (ไม่บังคับ)

`Latent` (รู้แล้ว ยังไม่ active) · `Dormant` (inactive อาจ active ใหม่) `Latent` bug ที่ active แล้ว ให้ยกระดับเป็น `Bug` issue เต็มพร้อม severity

## Labels ที่ต้องสร้าง

```sh
"C:\Program Files\GitHub CLI\gh.exe" label create \
  needs-triage needs-info ready-for-agent ready-for-human wontfix \
  Bug tech-debt security Optimization Cleanup Feature Test \
  critical Major Minor site content infra Latent Dormant
```

รายงานว่าสร้างอะไรบ้าง มีอยู่แล้วอะไรบ้าง และตัวไหนที่ vocabulary เรียกแต่ skip — vocabulary ที่ document ไว้แต่ไม่มี label รองรับ อ่านดูเหมือนตั้งไว้แล้ว ทั้งที่ไม่ใช่
