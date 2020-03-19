import * as React from 'react'
import { Project } from './api/types'
import { ProjectTeaser } from './components/project-teaser'
import { Header } from './components/header'
import { OfflineNotice } from './components/offline-notice'
import { PageHeader } from './components/page-header'
import { FilterPage } from './components/filter-page'
import { mkSome } from './lib/maybe'
import { ProjectPage } from './components/project-page'

const sample: Project = {"_id":"5b12fbccbf2d6b420ee6f454","headerImage":"public/uploads/baa93acd-a2a3-4df8-84d4-1290fae94119.png","emailUploader":"e.katerborg@hr.nl","spotlight":true,"title":"Beavers Be Dammed","author":"bla","year":2017,"duration":"4 maanden","youtube":"f0_xZcLQplw","tagline":"Avoid those weapons of Dam Destruction","description":"In Beavers Be Dammed your objective is to steal wood from sawmills before the time runs out. to beavery specific, you and a beaver buddy gnaw your way into the mill, locate the timber and maneuver those heavy logs towards the drop-off point.   BEAWARE! This is a situation of life and death! You will be dodging sharp saw blades, avoid being cooked by feisty flamethrowers and more weapons of dam destruction.   Features: Local multiplayer, Unique co-op experience, Full controller support,   Easy to pick up, hard to master","slug":"beavers-be-dammed","__v":0,"dateUpdated":new Date("2018-06-02T20:19:24.657Z"),"dateCreated":new Date("2018-06-02T20:19:24.657Z"),"tags":["minor","games","jaar4"],"screenshots":["public/uploads/c86901ab-3704-4c91-955a-4711956a16b3.png","public/uploads/2382822d-f733-43a3-9eec-0e3cad32e5ad.png","public/uploads/f11a9d95-e3d2-4d98-a0d6-3ff9dda0457c.png","public/uploads/7d3a1b7a-4482-4588-88e1-9237f1e6f419.png"],"websites":["http://beaversbedammed.com/","http://store.steampowered.com/app/764570/Beavers_Be_Dammed"],"_links":{"self":{"href":"https://cmgt.hr.nl:8000/api/projects/5b12fbccbf2d6b420ee6f454"},"collection":{"href":"https://cmgt.hr.nl:8000/api/projects/"}}}

const sampleTags: string[] = [
  "jaar1",
  "jaar2",
  "jaar3",
  "jaar4",
  "unity",
  "games",
  "cle",
  "iot",
  "machine-learning",
  "react",
  "functional-programming",
  "fedex"
]

export const App = () => (
  <div>
    <ProjectPage project={sample} />
    <FilterPage tags={sampleTags} open={false} selected={mkSome('jaar4')} >
      <PageHeader>
        <ProjectTeaser project={sample} size="large" />
      </PageHeader>
      <OfflineNotice />
      <ProjectTeaser project={sample} size="small" />
      <ProjectTeaser project={sample} size="small" />
      <ProjectTeaser project={sample} size="small" />
      <ProjectTeaser project={sample} size="small" />
    </FilterPage>
  </div>
)

