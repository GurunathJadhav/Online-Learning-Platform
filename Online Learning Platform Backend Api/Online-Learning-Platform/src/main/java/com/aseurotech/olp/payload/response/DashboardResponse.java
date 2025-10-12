package com.aseurotech.olp.payload.response;

import java.util.List;

public class DashboardResponse {

    private int totalCoursesEnrolled;
    private int pendingAssignments;
    private int completedAssignments;
    private List<String> topCourses;
    private int courseProgress;
    private List<String> enrolledCourses;
    private List<Integer> completionRate;
    private List<Integer> grades;

    public int getTotalCoursesEnrolled() {
        return totalCoursesEnrolled;
    }

    public void setTotalCoursesEnrolled(int totalCoursesEnrolled) {
        this.totalCoursesEnrolled = totalCoursesEnrolled;
    }

    public int getPendingAssignments() {
        return pendingAssignments;
    }

    public void setPendingAssignments(int pendingAssignments) {
        this.pendingAssignments = pendingAssignments;
    }

    public int getCompletedAssignments() {
        return completedAssignments;
    }

    public void setCompletedAssignments(int completedAssignments) {
        this.completedAssignments = completedAssignments;
    }

    public List<String> getTopCourses() {
        return topCourses;
    }

    public void setTopCourses(List<String> topCourses) {
        this.topCourses = topCourses;
    }

    public int getCourseProgress() {
        return courseProgress;
    }

    public void setCourseProgress(int courseProgress) {
        this.courseProgress = courseProgress;
    }

    public List<String> getEnrolledCourses() {
        return enrolledCourses;
    }

    public void setEnrolledCourses(List<String> enrolledCourses) {
        this.enrolledCourses = enrolledCourses;
    }

    public List<Integer> getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(List<Integer> completionRate) {
        this.completionRate = completionRate;
    }

    public List<Integer> getGrades() {
        return grades;
    }

    public void setGrades(List<Integer> grades) {
        this.grades = grades;
    }
}
