package it.gym.utility;

public class Constants {

    public static final long ROLE_ID_ADMIN = 1;
    public static final long ROLE_ID_TRAINER = 2;
    public static final long ROLE_ID_CUSTOMER = 3;

    public static final Long[] ROLES = {ROLE_ID_ADMIN, ROLE_ID_TRAINER, ROLE_ID_CUSTOMER};
    public static final String ROLE_NAME_ADMIN = "ADMIN";
    public static final String ROLE_NAME_CUSTOMER = "CUSTOMER";
    public static final String ROLE_NAME_TRAINER = "TRAINER";
    public static final String[] ROLE_NAMES = {ROLE_NAME_ADMIN, ROLE_NAME_TRAINER, ROLE_NAME_CUSTOMER};

    public final static String ROLE_BASE_PATH = "roles";
    public final static String TRAINER_BASE_PATH = "trainers";
    public final static String ADMIN_BASE_PATH = "admins";
    public final static String CUSTOMER_BASE_PATH = "customers";
    public final static String ROLE_CLASS_NAME = "Role";
    public static final String SALE_BASE_PATH = "sales";
    public static final String SALES_LINE_ITEM_BASE_PATH = "lines";
    public static final String  BUNDLE_BASE_PATH = "bundles";
    public static final String  SESSION_BASE_PATH = "sessions";
    public static final String BUNDLE_SPECS_BASE_PATH = "bundleSpecs";
    public static final String BASE_URL = "http://localhost:8080";
}
