import {getAllInterviewReports, generateInterviewReport, getInterviewReportById} from "../services/interview.api"
import { useCallback, useContext, useEffect } from "react"
import { InterviewContext } from "../interview-context"
import { useParams } from "react-router"

export const useInterview = () => {
    const context = useContext(InterviewContext)
    const {interviewId} = useParams()
    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const {loading, setLoading, report, setReport, reportError, setReportError, reports, setReports, reportsError, setReportsError} = context
    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setReportError("")
        try{
            const response = await generateInterviewReport({jobDescription, selfDescription, resumeFile})
            setReport(response.interviewReport)
            return response.interviewReport
        } finally{
            setLoading(false)
        }
    }

    const getReportById = useCallback(async (interviewId) => {
        setLoading(true)
        setReport(null)
        setReportError("")
        try{
            const response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch(err) {
            setReportError(err.response?.data?.message || err.message || "Unable to load this interview report.")
            return null
        } finally{
            setLoading(false)
        }
    }, [setLoading, setReport, setReportError])

    const getReports = useCallback(async () => {
        setLoading(true)
        setReportsError("")
        try{
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)
            return response.interviewReports
        } catch(err){
            setReportsError(err.response?.data?.message || err.message || "Unable to load your interview reports.")
            return []
        } finally{
            setLoading(false)
        }
    }, [setLoading, setReports, setReportsError])

    useEffect(()=>{
        if(interviewId){
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [interviewId, getReportById, getReports])

    return {loading, report, reportError, reports, reportsError, generateReport, getReportById, getReports}
}
