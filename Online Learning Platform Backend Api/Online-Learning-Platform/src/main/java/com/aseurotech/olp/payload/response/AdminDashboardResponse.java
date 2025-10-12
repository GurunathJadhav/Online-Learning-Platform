package com.aseurotech.olp.payload.response;

import java.util.List;

public class AdminDashboardResponse {

    private int numberOfUsers;
    private int numberOfInstructor;
    private int numberOfStudents;
    private int numberOfCourses;
    private int numberOfCourseEnrollment;
    private List<String> topCourses;
    private List<Integer> revenuePerCourse;
    private List<String> currentRegisteredUsers;

    public int getNumberOfUsers() {
        return numberOfUsers;
    }

    public void setNumberOfUsers(int numberOfUsers) {
        this.numberOfUsers = numberOfUsers;
    }

    public int getNumberOfInstructor() {
        return numberOfInstructor;
    }

    public void setNumberOfInstructor(int numberOfInstructor) {
        this.numberOfInstructor = numberOfInstructor;
    }

    public int getNumberOfStudents() {
        return numberOfStudents;
    }

    public void setNumberOfStudents(int numberOfStudents) {
        this.numberOfStudents = numberOfStudents;
    }

    public int getNumberOfCourses() {
        return numberOfCourses;
    }

    public void setNumberOfCourses(int numberOfCourses) {
        this.numberOfCourses = numberOfCourses;
    }

    public int getNumberOfCourseEnrollment() {
        return numberOfCourseEnrollment;
    }

    public void setNumberOfCourseEnrollment(int numberOfCourseEnrollment) {
        this.numberOfCourseEnrollment = numberOfCourseEnrollment;
    }

    public List<String> getTopCourses() {
        return topCourses;
    }

    public void setTopCourses(List<String> topCourses) {
        this.topCourses = topCourses;
    }

    public List<Integer> getRevenuePerCourse() {
        return revenuePerCourse;
    }

    public void setRevenuePerCourse(List<Integer> revenuePerCourse) {
        this.revenuePerCourse = revenuePerCourse;
    }

    public List<String> getCurrentRegisteredUsers() {
        return currentRegisteredUsers;
    }

    public void setCurrentRegisteredUsers(List<String> currentRegisteredUsers) {
        this.currentRegisteredUsers = currentRegisteredUsers;
    }
}
