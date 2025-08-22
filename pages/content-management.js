import React, { useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
// import { Api } from '@/utils/service';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import moment from 'moment';
import { userContext } from './_app';
import { Api } from '@/services/service';
import FAQ from '@/components/Faq';
// import FAQ from '@/src/components/Faq';
import { useTranslation } from 'react-i18next';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });
function ContentManagement(props) {
  const [terms, setTerms] = useState({
    termsAndConditions: '',
    privacy: ''
  })
  const [user, setUser] = useContext(userContext)
  const [privacyPolicy, setPrivacyPolicy] = useState({
    privacy: ''
  })
  const [tab, setTab] = useState('CONTENT')
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    getContent()
  }, [])

  const getContent = () => {
    props.loader(true);
    Api("get", "content", router).then(
      (res) => {
        console.log("res================>", res.data.incident);
        props.loader(false);

        if (res?.status) {
          setTerms({ ...res?.data, id: res?.data?._id })
        } else {
          console.log(res?.data?.message);
          props.toaster({ type: "error", message: res?.data?.message });
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.data?.message });
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  const termsSubmit = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't to update this contents",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!"
    }).then((result) => {
      if (result.isConfirmed) {
        props.loader(true);
        Api("post", "content", terms, router).then(
          (res) => {
            console.log("res================>", res.data.incident);
            props.loader(false);
            if (res?.status) {
              // console.log(res.data)
              props.toaster({ type: "success", message: res?.data?.message })

            } else {
              console.log(res?.data?.message);
              props.toaster({ type: "error", message: res?.data?.message });
            }
          },
          (err) => {
            props.loader(false);
            console.log(err);
            props.toaster({ type: "error", message: err?.data?.message });
            props.toaster({ type: "error", message: err?.message });
          }
        );
      }
    });
  }

  return (
    <section className="w-full h-full bg-transparent md:pt-5 pt-2 pb-5 pl-5 pr-5">
      <p className="text-white font-bold  md:text-[32px] text-2xl md:pb-0 pb-3">{t("Content Management")}</p>

      <div className='md:pb-32 pb-28 h-full  overflow-scroll md:mt-9 mt-5'>

        <div className='md:p-6 p-3 border-2 border-black rounded-2xl flex flex-col md:flex-row  items-center justify-between gap-2 md:gap-0'>
          <div className='flex flex-col md:flex-row md:gap-4 gap-2 text-center w-full'>
            <div className={` py-2 px-6 rounded-md  md:w-40 w-full cursor-pointer ${tab === 'FAQ' ? 'bg-black text-white' : 'bg-white border-2 text-black border-black'}`}
              onClick={() => {
                setTab('FAQ');
              }}>
              <p>{t("FAQ")}</p>
            </div>
            <div className={` py-2 px-6 rounded-md  md:w-60 w-full cursor-pointer ${tab === 'CONTENT' ? 'bg-black text-white' : 'bg-white border-2 text-black border-black'}`}
              onClick={() => setTab('CONTENT')}>
              <p>{t("Content Management")}</p>
            </div>
          </div>
        </div>

        {tab === 'CONTENT' && <div>
          <div className="md:grid grid-cols-2 bg-[#00000020] md:px-5 p-4 rounded-xl border-t-8 mt-5 border-black">
            <div className='md:mb-0 mb-0'>
              <p className="text-black font-bold md:text-3xl text-lg">
                {t("Terms and Condition")}
              </p>
            </div>
          </div>

          <section className='pb-4 relative'>
            <div className='w-[99%] mx-auto md:w-full bg-white h-full border-[3px] border-black rounded-lg p-3 md:p-8 flex flex-col overflow-auto space-y-4'>

              <div className='w-full  text-sm md:text-md rounded-2xl  space-y-4 border-t-[10px] border-black text-black'>
                <JoditEditor
                  className="editor max-h-screen overflow-auto"
                  rows={8}
                  value={terms?.termsAndConditions}
                  onChange={newContent => {
                    setTerms({
                      ...terms,
                      termsAndConditions: newContent,
                    });
                  }}
                />
              </div>
              <div className="flex gap-10 items-center justify-center md:justify-start">
                <button className="text-lg text-white font-semibold  bg-black rounded-lg md:py-2 py-1 px-2 md:px-8" onClick={termsSubmit}>{t("Update")}</button>
              </div>
            </div>
          </section>

          <div>
            <div className="md:grid grid-cols-2 bg-[#00000020] md:px-5 p-4 rounded-xl border-t-8 border-black">
              <div className='md:mb-0 mb-0'>
                <p className="text-black font-bold md:text-3xl text-lg">
                  {t("Privacy Policy")}
                </p>
              </div>
            </div>

            <section className='pb-4 relative'>
              <div className='w-[99%] mx-auto md:w-full bg-white h-full border-[3px] border-black rounded-lg p-3 md:p-8 flex flex-col overflow-auto space-y-4'>
                <div className='w-full  text-sm md:text-md rounded-2xl  space-y-4 border-t-[10px] border-black text-black'>
                  <JoditEditor
                    className="editor max-h-screen overflow-auto"
                    rows={8}
                    value={terms.privacy}
                    onChange={newContent => {
                      setTerms({
                        ...terms,
                        privacy: newContent
                      });
                    }}
                  />
                </div>
                <div className="flex gap-10 items-center justify-center md:justify-start">
                  <button className="text-lg text-white font-semibold  bg-black rounded-lg md:py-2 py-1 px-2 md:px-8" onClick={termsSubmit}>{t("Update")}</button>
                </div>
              </div>
            </section>
          </div>
        </div>}

        {
          tab === 'FAQ' &&
          <div>
            <div className="md:grid grid-cols-2 bg-[#00000020] md:px-5 p-4 rounded-xl border-t-8 mt-5 border-black">
              <div className='md:mb-0 mb-0'>
                <p className="text-black font-bold md:text-3xl text-lg">
                  {t("FAQ")}
                </p>
              </div>
            </div>
            <FAQ props={props} />
          </div>
        }

      </div>
    </section>
  );
}

export default ContentManagement