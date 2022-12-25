<!DOCTYPE html>
<html>

<head>
    <title>Title</title>
    <meta name="viewport"
        content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width" />
</head>

<body>
    <div id="q-app">
        <q-layout view="hHh lpR fFf">
            <q-header elevated class="bg-primary text-white">
            </q-header>
            <q-page-container>
                <q-dialog v-model="dialogMember" :maximized="true">
                    <q-card>
                        <q-card-section>
                            <q-card v-for="value in memberData" class="q-mb-md">
                                <q-card-section>
                                    <div class="text-subtitle1">!{ value.name }!</div>
                                </q-card-section>
                                <q-separator></q-separator>
                                <q-card-section>
                                    <span v-if="value.name === 'Name'">
                                        <span v-if="!member.insurances.length">Name.</span>
                                        <span v-else> Test </span>
                                    </span>
                                    <span v-else-if="value.name === 'Name1'">
                                        <span v-if="!member.checks.length">Name1.</span>
                                        <span v-else> Test </span>
                                    </span>
                                    <span v-else-if="value.name === 'Name2'">
                                        <span v-if="!member.rights.length">Name2.</span>
                                        <span v-else> Test </span>
                                    </span>
                                    <span v-else> Test </span>
                                </q-card-section>
                            </q-card>
                        </q-card-section>
                    </q-card>
                </q-dialog>
            </q-page-container>
        </q-layout>
    </div>
</body>

</html>
