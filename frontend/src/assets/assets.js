import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
// Law Instructor Profile Images
import law1 from './law1.png'
import law2 from './law2.png'
import law3 from './law3.png'
import law4 from './law4.png'
import law5 from './law5.png'
import law6 from './law6.png'
import law7 from './law7.png'
import law8 from './law8.png'
import law9 from './law9.png'
import law10 from './law10.png'



// Law Practice Specialty Icons
import Corporate_law from './Corporate_law.svg'
import Criminal_law from './Criminal_law.svg'
import Family_law from './Family_law.svg'
import Intellectual_property from './Intellectual_property.svg'




export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

// Law Practice Specialties Data
export const specialityData = [
    {
        speciality: 'Corporate Law',
        image: Corporate_law
    },
    {
        speciality: 'Criminal Law',
        image: Criminal_law
    },
    {
        speciality: 'Family Law',
        image: Family_law
    },
    {
        speciality: 'Intellectual Property',
        image: Intellectual_property
    },
   
]

// Legal Educators/Instructors Data
export const instructors = [
    {
        _id: 'law1',
        name: 'Prof. Richard James',
        image: law1,
        speciality: 'Corporate Law',
        degree: 'JD, LLM',
        experience: '15 Years',
        about: 'Prof. James has extensive experience in corporate legal practice and education, specializing in mergers & acquisitions, corporate governance, and securities law. He brings practical insights from his years in BigLaw firms to provide comprehensive legal education focused on real-world applications and case studies.',
        fees: 150,
        address: {
            line1: '17th Floor, Legal Complex',
            line2: 'Business District, New York'
        }
    },
    {
        _id: 'law2',
        name: 'Prof. Emily Larson',
        image: law2,
        speciality: 'Criminal Law',
        degree: 'JD, LLM',
        experience: '12 Years',
        about: 'Prof. Larson is a distinguished criminal law expert with experience as both a prosecutor and defense attorney. She specializes in criminal procedure, constitutional law, and trial advocacy, offering students comprehensive understanding of the criminal justice system and courtroom practice.',
        fees: 180,
        address: {
            line1: '27th Floor, Justice Center',
            line2: 'Downtown Legal District, Chicago'
        }
    },
    {
        _id: 'law3',
        name: 'Prof. Sarah Patel',
        image: law3,
        speciality: 'Family Law',
        degree: 'JD, MSW',
        experience: '8 Years',
        about: 'Prof. Patel combines legal expertise with social work background to provide holistic family law education. She specializes in divorce proceedings, child custody, adoption law, and domestic relations, emphasizing both legal strategy and client counseling skills.',
        fees: 120,
        address: {
            line1: '37th Street, Family Court Building',
            line2: 'Legal Plaza, Los Angeles'
        }
    },
    {
        _id: 'law4',
        name: 'Prof. Christopher Lee',
        image: law4,
        speciality: 'Intellectual Property',
        degree: 'JD, MS Engineering',
        experience: '10 Years',
        about: 'Prof. Lee brings unique technical and legal expertise to intellectual property law education. With engineering background and extensive patent law practice, he teaches comprehensive IP protection strategies, patent prosecution, trademark law, and copyright issues.',
        fees: 200,
        address: {
            line1: '47th Floor, Innovation Tower',
            line2: 'Tech Legal Center, San Francisco'
        }
    },
    {
        _id: 'law5',
        name: 'Prof. Jennifer Garcia',
        image: law5,
        speciality: 'Employment Law',
        degree: 'JD, MBA',
        experience: '14 Years',
        about: 'Prof. Garcia specializes in employment and labor law with extensive experience in workplace discrimination, wage and hour disputes, and employment contracts. She provides practical training on HR compliance, workplace investigations, and employment litigation strategies.',
        fees: 160,
        address: {
            line1: '57th Avenue, Corporate Legal Center',
            line2: 'Business Law District, Boston'
        }
    },
    {
        _id: 'law6',
        name: 'Prof. Andrew Williams',
        image: law6,
        speciality: 'Employment Law',
        degree: 'JD, MA Labor Relations',
        experience: '11 Years',
        about: 'Prof. Williams focuses on collective bargaining, union relations, and workplace safety regulations. His background in labor relations provides students with comprehensive understanding of both individual employment rights and collective labor law principles.',
        fees: 165,
        address: {
            line1: '57th Avenue, Labor Law Institute',
            line2: 'Union Square, Seattle'
        }
    },
    {
        _id: 'law7',
        name: 'Prof. Christopher Davis',
        image: law7,
        speciality: 'Corporate Law',
        degree: 'JD, MBA',
        experience: '16 Years',
        about: 'Prof. Davis combines legal expertise with business acumen to teach corporate law from both legal and business perspectives. He specializes in corporate finance, business transactions, and regulatory compliance, preparing students for modern corporate legal practice.',
        fees: 175,
        address: {
            line1: '17th Floor, Corporate Legal Academy',
            line2: 'Financial District, New York'
        }
    },
    {
        _id: 'law8',
        name: 'Prof. Timothy White',
        image: law8,
        speciality: 'Criminal Law',
        degree: 'JD, LLM Criminal Justice',
        experience: '13 Years',
        about: 'Prof. White is a former federal prosecutor with expertise in white-collar crime, federal criminal procedure, and appellate advocacy. He provides students with comprehensive training in criminal law theory and practice, including trial preparation and courtroom advocacy.',
        fees: 190,
        address: {
            line1: '27th Floor, Criminal Justice Center',
            line2: 'Federal Court District, Washington DC'
        }
    },
    {
        _id: 'law9',
        name: 'Prof. Ava Mitchell',
        image: law9,
        speciality: 'Family Law',
        degree: 'JD, LLM Family Law',
        experience: '7 Years',
        about: 'Prof. Mitchell specializes in complex family law matters including high-asset divorce, international child custody, and alternative dispute resolution. She emphasizes both traditional litigation skills and modern mediation techniques in family law practice.',
        fees: 130,
        address: {
            line1: '37th Street, Family Mediation Center',
            line2: 'Alternative Dispute Resolution Plaza, Denver'
        }
    },
    {
        _id: 'law10',
        name: 'Prof. Jeffrey King',
        image: law10,
        speciality: 'Intellectual Property',
        degree: 'JD, PhD Computer Science',
        experience: '9 Years',
        about: 'Prof. King combines advanced technical knowledge with IP law expertise, specializing in software patents, technology licensing, and cyber law. He provides cutting-edge education on emerging technologies and their intellectual property implications.',
        fees: 210,
        address: {
            line1: '47th Floor, Tech Innovation Legal Hub',
            line2: 'Silicon Valley Legal Center, San Jose'
        }
    },
    ]
