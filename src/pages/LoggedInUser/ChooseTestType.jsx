import React from 'react'
import Folder from '../../components/Folder'
import { faBed, faRocket } from '@fortawesome/free-solid-svg-icons'
import PageWrapper from '../../components/PageWrapper';

export default function ChooseTestType() {
  return (
    <PageWrapper title={"اختيار نوع الاختبار"}>
      <div className="flex gap-5 justify-center max-md:flex-col">
        <Folder path={"/createTest/normal"} text={"على مهلك"} icon={faBed} />
        <Folder path={"/createTest/time"} text={"انجز نفسك"} icon={faRocket} />
      </div>
    </PageWrapper>
  );
}
