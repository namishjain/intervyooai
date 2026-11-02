import {getAllInterviewReports, generateInterviewReport, getInterviewReportById, isValidInterviewId} from "../services/interview.api"
import { useCallback, useContext, useEffect } from "react"
import { InterviewContext } from "../interview-context"
import { useParams } from "react-router"
import { getErrorMessage } from "../../../lib/error-message"

export const useInterview = ({loadReports = true} = {}) => {
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
            if (!response?.interviewReport?._id) {
                throw new Error("The server returned an invalid interview report.")
            }
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
            if (!response?.interviewReport?._id) {
                throw new Error("The server returned an invalid interview report.")
            }
            setReport(response.interviewReport)
            return response.interviewReport
        } catch(err) {
            setReportError(getErrorMessage(err, "Unable to load this interview report. Please try again."))
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
            if (!Array.isArray(response?.interviewReports)) {
                throw new Error("The server returned an invalid report list.")
            }
            setReports(response.interviewReports)
            return response.interviewReports
        } catch(err){
            setReportsError(getErrorMessage(err, "Unable to load your interview reports. Please try again."))
            return []
        } finally{
            setLoading(false)
        }
    }, [setLoading, setReports, setReportsError])

    useEffect(()=>{
        if(interviewId){
            if(isValidInterviewId(interviewId)){
                getReportById(interviewId)
            }
        } else if(loadReports) {
            getReports()
        }
    }, [interviewId, loadReports, getReportById, getReports])

    return {loading, report, reportError, reports, reportsError, generateReport, getReportById, getReports}
}
