const pdfParse = require("pdf-parse")
const {generateInterviewReport, generateResumePdf} = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

function createRequestError(message){
    const error = new Error(message)
    error.statusCode = 400
    error.userMessage = message
    return error
}

async function generateInterViewController(req,res){
    const {selfDescription, jobDescription} = req.body || {}
    if(typeof jobDescription !== "string" || !jobDescription.trim()){
        throw createRequestError("Please provide a job description.")
    }
    if(typeof selfDescription !== "string" || !selfDescription.trim()){
        throw createRequestError("Please provide a self-description.")
    }
    if(!req.file){
        throw createRequestError("Please upload your resume as a PDF file.")
    }

    let resume
    try{
        resume = (await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()).text.trim()
    } catch(error){
        const parseError = createRequestError("We could not read that resume. Please upload a valid PDF.")
        parseError.cause = error
        throw parseError
    }
    if(!resume){
        throw createRequestError("The uploaded PDF does not contain readable text. Please upload a text-based PDF resume.")
    }

    const interviewReportByAi = await generateInterviewReport({
        resume,
        selfDescription: selfDescription.trim(),
        jobDescription: jobDescription.trim()
    })

    const interviewReport = await interviewReportModel.create({
        user:req.user.id,
        resume,
        selfDescription: selfDescription.trim(),
        jobDescription: jobDescription.trim(),
        ...interviewReportByAi
    })
    res.status(201).json({
        message: "Interview report generated successfully",
        interviewReport
    })
}

async function getInterviewReportByIdController(req,res){
    const {interviewId} = req.params
    const interviewReport = await interviewReportModel.findOne({_id:interviewId, user:req.user.id})

    if(!interviewReport){
        return res.status(404).json({
            message:"Interview Report not found."
        })
    }
    res.status(200).json({
        message: "Interview report fetched successfully",
        interviewReport
    })
}

async function getAllInterviewReportsController(req, res){
    const interviewReports = await interviewReportModel.find({user:req.user.id}).sort({createdAt: -1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
    res.status(200).json({
        message: "Interview reports fetched successfully",
        interviewReports
    })
}

/**
 * @description Controller to generate resume pdf based on user self description, resume and job description
 */

async function generateResumePdfController(req, res){
    const {interviewReportId} = req.params

    const interviewReport = await interviewReportModel.findOne({
        _id:interviewReportId,
        user:req.user.id
    })
    if(!interviewReport){
        return res.status(404).json({
            message: "Interview Report not found."
        })
    }
    const {resume, jobDescription, selfDescription} = interviewReport
    const pdfBuffer = await generateResumePdf({resume, jobDescription, selfDescription})

    res.set({
        "Content-Type":"application/pdf",
        "Content-Disposition":`attachment; filename=resume_${interviewReportId}.pdf`
    })
    res.send(pdfBuffer)
}

module.exports = {generateInterViewController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController}