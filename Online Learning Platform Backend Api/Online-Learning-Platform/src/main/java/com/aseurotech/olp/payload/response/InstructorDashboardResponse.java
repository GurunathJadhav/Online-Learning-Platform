package com.aseurotech.olp.payload.response;

import java.util.List;

public class InstructorDashboardResponse {

    private int totalCourses;
    private int totalEnrolled;
    private int totalAssignmentCompleted;
    private int totalAssignmentPending;
    private List<String> topCourses;
    private List<String> enrolledCourses;
    private List<Integer> totalEnrolledUsersEachCourse;
    private List<Integer> totalGradesEachCourse;
    private List<Integer> eachCourseCompletionRate;

    public int getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(int totalCourses) {
        this.totalCourses = totalCourses;
    }

    public int getTotalEnrolled() {
        return totalEnrolled;
    }

    public void setTotalEnrolled(int totalEnrolled) {
        this.totalEnrolled = totalEnrolled;
    }

    public int getTotalAssignmentCompleted() {
        return totalAssignmentCompleted;
    }

    public void setTotalAssignmentCompleted(int totalAssignmentCompleted) {
        this.totalAssignmentCompleted = totalAssignmentCompleted;
    }

    public int getTotalAssignmentPending() {
        return totalAssignmentPending;
    }

    public void setTotalAssignmentPending(int totalAssignmentPending) {
        this.totalAssignmentPending = totalAssignmentPending;
    }

    public List<String> getTopCourses() {
        return topCourses;
    }

    public void setTopCourses(List<String> topCourses) {
        this.topCourses = topCourses;
    }

    public List<String> getEnrolledCourses() {
        return enrolledCourses;
    }

    public void setEnrolledCourses(List<String> enrolledCourses) {
        this.enrolledCourses = enrolledCourses;
    }

    public List<Integer> getTotalEnrolledUsersEachCourse() {
        return totalEnrolledUsersEachCourse;
    }

    public void setTotalEnrolledUsersEachCourse(List<Integer> totalEnrolledUsersEachCourse) {
        this.totalEnrolledUsersEachCourse = totalEnrolledUsersEachCourse;
    }

    public List<Integer> getTotalGradesEachCourse() {
        return totalGradesEachCourse;
    }

    public void setTotalGradesEachCourse(List<Integer> totalGradesEachCourse) {
        this.totalGradesEachCourse = totalGradesEachCourse;
    }

    public List<Integer> getEachCourseCompletionRate() {
        return eachCourseCompletionRate;
    }

    public void setEachCourseCompletionRate(List<Integer> eachCourseCompletionRate) {
        this.eachCourseCompletionRate = eachCourseCompletionRate;
    }
}
